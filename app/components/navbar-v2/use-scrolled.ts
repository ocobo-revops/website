import * as React from 'react';

/**
 * Scroll offset in pixels before the bar turns into a pill.
 */
export const SCROLL_THRESHOLD = 30;

/**
 * True once the page has scrolled past the threshold.
 * Starts false on the server and on the first client render.
 */
export function useScrolled(threshold = SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [threshold]);

  return scrolled;
}
