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

type UseInViewOptions = {
  /** Grows or shrinks the viewport used to trigger the reveal. */
  rootMargin?: string;
  /** Share of the element that must be visible, from 0 to 1. */
  threshold?: number;
};

type UseInViewResult<T extends Element> = {
  ref: RefObject<T>;
  inView: boolean;
};

// On screen or scrolled past: either way the visitor has seen its place.
function isAboveFold(element: Element): boolean {
  return element.getBoundingClientRect().top < window.innerHeight;
}

/**
 * Reveals an element once, the first time it enters the viewport.
 *
 * `inView` starts true, so the server render and a page without JavaScript
 * show the final state. After hydration, only an element below the fold is
 * hidden, then revealed on appearance; one on screen or above it never
 * blinks.
 * Under reduced motion, without IntersectionObserver, or once revealed,
 * `inView` stays true. The ref must stay on the same element.
 */
export function useInView<T extends Element>({
  // Reveal once the element is 10% of the viewport height inside it.
  rootMargin = '0px 0px -10% 0px',
  threshold = 0,
}: UseInViewOptions = {}): UseInViewResult<T> {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (
      revealed ||
      !element ||
      prefersReducedMotion ||
      matchesReducedMotion() ||
      typeof IntersectionObserver === 'undefined' ||
      isAboveFold(element)
    ) {
      // Never hide again an element the visitor may have seen.
      setInView(true);
      if (element) setRevealed(true);
      return;
    }

    setInView(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setInView(true);
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, revealed, rootMargin, threshold]);

  return { ref, inView };
}
