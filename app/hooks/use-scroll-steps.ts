import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  matchesReducedMotion,
  usePrefersReducedMotion,
} from './use-prefers-reduced-motion';

// useLayoutEffect warns on the server; it never runs there anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Scroll progress of an element, as the mockup computes it: -1 while its top
 * sits below 80% of the viewport, then 0 to 1 over the next half viewport.
 */
export function scrollStepProgress(top: number, viewportHeight: number) {
  const progress = (viewportHeight * 0.8 - top) / (viewportHeight * 0.5);
  if (progress < 0) return -1;
  return Math.min(progress, 1);
}

/** Number of thresholds, sorted ascending, that `progress` has reached. */
export function countReached(thresholds: readonly number[], progress: number) {
  return thresholds.filter((threshold) => progress >= threshold).length;
}

type UseScrollStepsResult<T extends Element> = {
  ref: RefObject<T>;
  /**
   * How many steps are shown, or null when every step shows: on the server,
   * under reduced motion, and before hydration.
   */
  reached: number | null;
  /**
   * False until the first measure has painted, so the steps the visitor
   * cannot reach yet are hidden at once instead of fading out.
   */
  animate: boolean;
};

/**
 * Reveals steps one by one as the visitor scrolls an element into view, and
 * hides them again when scrolling back up (the mockup `#ia8` scrub).
 * `thresholds` must be sorted ascending and keep the same values.
 */
export function useScrollSteps<T extends Element>(
  thresholds: readonly number[],
): UseScrollStepsResult<T> {
  const ref = useRef<T>(null);
  const [reached, setReached] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const thresholdsRef = useRef(thresholds);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || matchesReducedMotion()) {
      setReached(null);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = scrollStepProgress(
        element.getBoundingClientRect().top,
        window.innerHeight,
      );
      setReached(countReached(thresholdsRef.current, progress));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    const settle = window.requestAnimationFrame(() => setAnimate(true));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(settle);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return { ref, reached, animate };
}
