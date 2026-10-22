import {
  type MotionValue,
  type UseScrollOptions,
  useMotionValue,
  useScroll,
  useSpring,
} from 'framer-motion';

import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

type ScrollProgress = {
  /** Scroll progress from 0 to 1, smoothed by a spring. */
  progress: MotionValue<number>;
  /** False under reduced motion: hide the progress indicator. */
  enabled: boolean;
};

/**
 * Scroll progress of the page, or of `target` with framer-motion offsets.
 * Under reduced motion it is off: `enabled` is false and `progress` holds
 * its final value, 1, without any spring.
 */
export function useScrollProgress(
  options: Pick<UseScrollOptions, 'target' | 'offset'> = {},
): ScrollProgress {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll(options);
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });
  const final = useMotionValue(1);

  return prefersReducedMotion
    ? { progress: final, enabled: false }
    : { progress: smoothed, enabled: true };
}
