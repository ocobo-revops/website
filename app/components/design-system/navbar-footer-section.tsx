import type { ReactNode } from 'react';

import { css } from '@ocobo/styled-system/css';

import { FooterV2 } from '~/components/footer-v2/footer-v2';
import { NavbarBar } from '~/components/navbar-v2/navbar-bar';

import { ShowcaseSection } from './showcase-section';

const caption = css({
  fontSize: 'caption',
  fontWeight: 'bold',
  color: 'gray',
  mb: '2',
});

const frame = css({
  p: '4',
  bg: 'gray.50',
  borderWidth: '1px',
  borderColor: 'line',
  rounded: '2xl',
});

const mobileFrame = css({ maxW: 'sm' });

function Preview({
  label,
  mobile = false,
  children,
}: {
  label: string;
  mobile?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={mobile ? mobileFrame : undefined}>
      <figcaption className={caption}>{label}</figcaption>
      <div className={frame}>{children}</div>
    </figure>
  );
}

/**
 * v2 navbar and footer (J2), shown before they replace v1 in the layout.
 * The mobile previews force the mobile layout at any viewport width.
 */
export function NavbarFooterSection() {
  return (
    <ShowcaseSection title="Navbar and footer (v2)">
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '8' })}
      >
        <Preview label="Navbar, desktop, top of page">
          <NavbarBar scrolled={false} />
        </Preview>
        <Preview label="Navbar, desktop, scrolled">
          <NavbarBar scrolled />
        </Preview>
        <Preview label="Navbar, mobile (open the menu with the burger)" mobile>
          <NavbarBar scrolled={false} layout="mobile" />
        </Preview>
        <Preview label="Footer, desktop">
          <FooterV2 />
        </Preview>
        <Preview label="Footer, mobile" mobile>
          <FooterV2 layout="mobile" />
        </Preview>
      </div>
    </ShowcaseSection>
  );
}
