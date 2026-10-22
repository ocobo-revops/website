// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInView } from './use-in-view';

let observerCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

const motionPreference = { matches: false, listeners: new Set<() => void>() };

function stubReducedMotion(matches: boolean) {
  motionPreference.matches = matches;
  motionPreference.listeners.clear();
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return motionPreference.matches;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) =>
        motionPreference.listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) =>
        motionPreference.listeners.delete(listener),
    })),
  );
}

function toggleReducedMotion(matches: boolean) {
  act(() => {
    motionPreference.matches = matches;
    for (const listener of motionPreference.listeners) listener();
  });
}

function stubElementTop(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 100,
  } as DOMRect);
}

function Probe() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="probe">
      {inView ? 'visible' : 'hidden'}
    </div>
  );
}

function intersect(isIntersecting: boolean) {
  act(() => {
    observerCallback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  stubReducedMotion(false);
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(
      class {
        observe = mockObserve;
        disconnect = mockDisconnect;
        unobserve = vi.fn();
        constructor(cb: IntersectionObserverCallback) {
          observerCallback = cb;
        }
      },
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useInView', () => {
  it('returns the final state at once under reduced motion', () => {
    stubReducedMotion(true);
    stubElementTop(5000);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(IntersectionObserver).not.toHaveBeenCalled();
  });

  it('keeps an element already on screen visible', () => {
    stubElementTop(10);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(IntersectionObserver).not.toHaveBeenCalled();
  });

  it('hides an element below the fold until it appears', () => {
    stubElementTop(5000);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    expect(mockObserve).toHaveBeenCalledOnce();

    intersect(false);
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');

    intersect(true);
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('keeps an element scrolled past visible', () => {
    stubElementTop(-2000);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
  });

  it('shows a hidden element when reduced motion turns on', () => {
    stubElementTop(5000);
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden');

    toggleReducedMotion(true);
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('never hides an element again once revealed', () => {
    stubElementTop(5000);
    render(<Probe />);
    intersect(true);

    toggleReducedMotion(true);
    toggleReducedMotion(false);
    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
  });

  it('stays visible without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    stubElementTop(5000);
    render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('visible');
  });

  it('disconnects the observer on unmount', () => {
    stubElementTop(5000);
    const { unmount } = render(<Probe />);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
