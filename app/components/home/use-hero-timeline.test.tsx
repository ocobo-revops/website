// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useHeroTimeline } from './use-hero-timeline';

let observerCallbacks: IntersectionObserverCallback[] = [];
let frames = new Map<number, FrameRequestCallback>();
let nextFrame = 1;

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

/** Runs the pending animation frames at `now` milliseconds. */
function tick(now: number) {
  act(() => {
    const pending = [...frames.values()];
    frames = new Map();
    for (const callback of pending) callback(now);
  });
}

function Probe() {
  const { ref, time, paused, togglePaused } = useHeroTimeline();
  return (
    <section ref={ref}>
      <output>{time === null ? 'settled' : time.toFixed(2)}</output>
      <button type="button" onClick={togglePaused}>
        {paused ? 'play' : 'pause'}
      </button>
    </section>
  );
}

const clock = () => screen.getByRole('status').textContent;

beforeEach(() => {
  observerCallbacks = [];
  frames = new Map();
  nextFrame = 1;
  stubReducedMotion(false);
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallbacks.push(callback);
      }
    },
  );
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextFrame++;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useHeroTimeline', () => {
  it('keeps the settled picture under reduced motion', () => {
    stubReducedMotion(true);
    render(<Probe />);

    expect(clock()).toBe('settled');
    expect(frames.size).toBe(0);
  });

  it('keeps the settled picture without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Probe />);

    expect(clock()).toBe('settled');
  });

  it('starts from zero and counts seconds', () => {
    render(<Probe />);
    expect(clock()).toBe('0.00');

    tick(1000);
    tick(2500);
    expect(clock()).toBe('1.50');
  });

  it('stops while paused and resumes without a jump', () => {
    render(<Probe />);
    tick(0);
    tick(1000);

    fireEvent.click(screen.getByRole('button', { name: 'pause' }));
    expect(frames.size).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: 'play' }));
    tick(9000);
    tick(9500);
    expect(clock()).toBe('1.50');
  });

  it('stops while the hero is off screen', () => {
    render(<Probe />);
    tick(0);

    act(() => {
      for (const callback of observerCallbacks) {
        callback(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver,
        );
      }
    });
    expect(frames.size).toBe(0);
  });
});
