// @vitest-environment jsdom
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInView } from './use-in-view';

let observerCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
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
    vi.fn((cb: IntersectionObserverCallback) => {
      observerCallback = cb;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      };
    }),
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
