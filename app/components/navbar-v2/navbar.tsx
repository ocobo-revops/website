import { css } from '@ocobo/styled-system/css';

import type { NavItem } from '~/components/navbar/types';

import { NavbarBar } from './navbar-bar';
import { useScrolled } from './use-scrolled';

type NavbarV2Props = {
  /** Enjeu entry slot (#237), see `NavbarBar`. */
  leadingItems?: NavItem[];
};

/**
 * v2 navbar, fixed to the top of the viewport. Built but not switched on:
 * `LayoutMain` still renders the v1 navbar until #242.
 */
export function NavbarV2({ leadingItems }: NavbarV2Props) {
  const scrolled = useScrolled();

  return (
    <header
      className={css({
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: 1000,
        p: { base: '4', lg: '6' },
        pointerEvents: 'none',
        '& > nav': { pointerEvents: 'auto' },
      })}
    >
      <NavbarBar scrolled={scrolled} leadingItems={leadingItems} />
    </header>
  );
}
