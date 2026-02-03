import * as React from 'react';

import type { NavbarScrollState, ScrollDirection } from './types';

type UseNavbarScrollReturn = {
  scrollState: NavbarScrollState;
  scrollDirection: ScrollDirection;
  scrollY: number;
};

const SCROLL_THRESHOLD = 30;

export function useNavbarScroll(): UseNavbarScrollReturn {
  const [scrollY, setScrollY] = React.useState(0);
  const [scrollDirection, setScrollDirection] =
    React.useState<ScrollDirection>('up');
  const previousScrollY = React.useRef(0);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const direction =
          currentScrollY > previousScrollY.current ? 'down' : 'up';

        previousScrollY.current = currentScrollY;
        setScrollY(currentScrollY);
        setScrollDirection(direction);
        ticking.current = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollState: NavbarScrollState =
    scrollY > SCROLL_THRESHOLD ? 'scrolled' : 'at-top';

  return { scrollState, scrollDirection, scrollY };
}
