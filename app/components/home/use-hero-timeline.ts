import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useInView } from '~/hooks/use-in-view';
import {
  matchesReducedMotion,
  usePrefersReducedMotion,
} from '~/hooks/use-prefers-reduced-motion';

// useLayoutEffect warns on the server; it never runs there anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Longest step of the clock, in milliseconds. */
const MAX_STEP = 100;

type HeroTimeline = {
  ref: RefObject<HTMLElement>;
  /** Seconds since the animation started, or null for the settled picture. */
  time: number | null;
  paused: boolean;
  togglePaused: () => void;
};

/**
 * Clock of the home hero animation.
 *
 * The server render, a page without JavaScript and reduced motion get
 * `time: null`: the settled picture. After hydration the clock goes back to
 * zero before the first paint, then runs once the hero is revealed
 * (`useInView`, which is immediate for a hero at the top of the page). It
 * stops while the hero is off screen or paused, and resumes where it was.
 * Attach `ref` to the whole hero: the headline accents start with it, even
 * when the visual itself sits below the fold.
 */
export function useHeroTimeline(): HeroTimeline {
  // The hero is taller than a short viewport: any visible part reveals it.
  const { ref, inView } = useInView<HTMLElement>();
  const reducedMotion = usePrefersReducedMotion();
  const [time, setTime] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const elapsed = useRef(0);

  useIsomorphicLayoutEffect(() => {
    if (
      reducedMotion ||
      matchesReducedMotion() ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setTime(null);
      return;
    }
    elapsed.current = 0;
    setTime(0);
  }, [reducedMotion]);

  // Spare the frames while the visitor reads further down the page.
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    // The last entry is the most recent state of the hero.
    const observer = new IntersectionObserver((entries) =>
      setOnScreen(entries[entries.length - 1]?.isIntersecting ?? false),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  const playing = time !== null && inView && onScreen && !paused;

  useEffect(() => {
    if (!playing) return;
    let last: number | null = null;
    let frame = 0;
    const tick = (now: number) => {
      // The first tick only sets the origin, so a resume does not jump. A
      // long gap (a background tab) counts as one step, so the intro waits.
      if (last !== null)
        elapsed.current += Math.min(now - last, MAX_STEP) / 1000;
      last = now;
      setTime(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return {
    ref,
    time,
    paused,
    togglePaused: () => setPaused((current) => !current),
  };
}
