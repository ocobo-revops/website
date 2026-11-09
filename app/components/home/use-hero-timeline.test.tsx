// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useHeroTimeline } from './use-hero-timeline';

let observerCallbacks: IntersectionObserverCallback[] = [];
let frames = new Map<number, FrameRequestCallback>();
let nextFrame = 1;
let reducedMotion = false;
let motionListeners: (() => void)[] = [];

function stubReducedMotion(matches: boolean) {
  reducedMotion = matches;
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      get matches() {
        return reducedMotion;
      },
      media: query,
      addEventListener: (_: string, listener: () => void) =>
        motionListeners.push(listener),
      removeEventListener: (_: string, listener: () => void) => {
        motionListeners = motionListeners.filter((l) => l !== listener);
      },
    })),
  );
}

/** Tells every IntersectionObserver whether the hero is on screen. */
function intersect(isIntersecting: boolean) {
  act(() => {
    for (const callback of observerCallbacks) {
      callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
}

/** Runs the pending animation frames at `now` milliseconds. */
function tick(now: number) {
  act(() => {
    const pending = [...frames.values()];
    frames = new Map();
    for (const callback of pending) callback(now);
  });
}

/** Runs frames every 50 ms from `from` to `to`, both included. */
function play(from: number, to: number) {
  for (let now = from; now <= to; now += 50) tick(now);
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
  motionListeners = [];
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
  vi.restoreAllMocks();
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

    play(1000, 2500);
    expect(clock()).toBe('1.50');
  });

  it('stops while paused and resumes without a jump', () => {
    render(<Probe />);
    play(0, 1000);

    fireEvent.click(screen.getByRole('button', { name: 'pause' }));
    expect(frames.size).toBe(0);

    fireEvent.click(screen.getByRole('button', { name: 'play' }));
    play(9000, 9500);
    expect(clock()).toBe('1.50');
  });

  it('stops off screen and resumes without a jump', () => {
    render(<Probe />);
    play(0, 1000);

    intersect(false);
    expect(frames.size).toBe(0);

    intersect(true);
    play(30000, 30500);
    expect(clock()).toBe('1.50');
  });

  it('counts a long gap as one short step', () => {
    render(<Probe />);
    tick(0);
    tick(60000);

    expect(clock()).toBe('0.10');
  });

  it('waits for the reveal when the hero is below the fold', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight + 100,
    } as DOMRect);
    render(<Probe />);
    expect(frames.size).toBe(0);

    intersect(true);
    expect(frames.size).toBe(1);
  });

  it('goes back to the settled picture when reduced motion turns on', () => {
    render(<Probe />);
    tick(0);
    tick(500);

    act(() => {
      reducedMotion = true;
      for (const listener of motionListeners) listener();
    });
    expect(clock()).toBe('settled');
    expect(frames.size).toBe(0);
  });
});
