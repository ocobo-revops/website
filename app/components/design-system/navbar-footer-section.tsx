import type { ReactNode } from 'react';

import { css } from '@ocobo/styled-system/css';

import { challengePalette } from '~/components/challenges/challenge-palette';
import { FooterV2 } from '~/components/footer-v2/footer-v2';
import { NavbarBar } from '~/components/navbar-v2/navbar-bar';
import type { NavItem } from '~/components/navbar/types';
import { placeChallengeItem, useMenuItems } from '~/hooks/useMenuItems';

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
 * Sample challenges: the design-system route has no challenge loader, so
 * the production menu would show the offer entry instead (#315).
 */
const sampleChallenges: NavItem = {
  key: 'challenges',
  label: 'Vos enjeux',
  path: null,
  dropdown: [
    ['rp', 'Revenue Process', 'Structurer un process qui convertit'],
    ['se', 'Sales Enablement', 'Rendre chaque commercial autonome'],
    ['sc', 'Sales Compensation', 'Payer ce qui fait croître'],
    ['cx', 'Customer Experience', 'Faire grandir les clients signés'],
    ['sy', 'Revenue Systems', 'Un CRM que les équipes utilisent'],
    ['ai', 'Revenue AI', "Mettre l'IA au service du revenu"],
  ].map(([key, label, description]) => ({
    key: `challenge-${key}`,
    label,
    description,
    path: `/fr/challenges/${key}`,
    palette: challengePalette[key as keyof typeof challengePalette],
  })),
};

const sampleAiItem: NavItem = {
  key: 'ai',
  label: 'IA',
  path: '/fr/challenges/ai',
};

/**
 * The DS frame is narrower than the page, so each preview keeps only the
 * entries it demonstrates. The others are hidden, not removed, so the ROI
 * card can still read the resources menu.
 */
function keepOnly(items: NavItem[], keys: string[]): NavItem[] {
  return items.map((item) =>
    item.isButton || keys.includes(item.key)
      ? item
      : { ...item, shouldHide: true },
  );
}

const desktopKeys = ['offer', 'method', 'company'];
const sampleKeys = ['challenges', 'method', 'ai'];

/**
 * Production menu with the sample challenges and the IA link. `withRoi`
 * forces the ROI calculator on or off, so each preview shows its method
 * panel whatever the page flag says.
 */
function useSampleMenu(withRoi: boolean): NavItem[] {
  const production = useMenuItems().filter((item) => item.key !== 'ai');
  const items = production.flatMap((item) => {
    // The ROI card follows this preview, whatever the live page flag says.
    const shown = item.dropdown
      ? {
          ...item,
          dropdown: item.dropdown.map((sub) =>
            sub.key === 'roi' ? { ...sub, shouldHide: !withRoi } : sub,
          ),
        }
      : item;
    return item.key === 'resources' ? [sampleAiItem, shown] : [shown];
  });
  return keepOnly(placeChallengeItem(items, sampleChallenges), sampleKeys);
}

/**
 * v2 navbar and footer (J2), shown before they replace v1 in the layout.
 * The mobile previews force the mobile layout at any viewport width.
 */
export function NavbarFooterSection() {
  const sampleMenu = useSampleMenu(false);
  const sampleMenuWithRoi = useSampleMenu(true);
  const desktopMenu = keepOnly(useMenuItems(), desktopKeys);

  return (
    <ShowcaseSection title="Navbar and footer (v2)">
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '8' })}
      >
        <Preview label="Navbar, desktop, top of page">
          <NavbarBar scrolled={false} items={desktopMenu} />
        </Preview>
        <Preview label="Navbar, desktop, scrolled">
          <NavbarBar scrolled items={desktopMenu} />
        </Preview>
        <Preview label="Navbar, mobile (open the menu with the burger)" mobile>
          <NavbarBar scrolled={false} layout="mobile" />
        </Preview>
        <Preview label="Navbar panels, sample challenges (hover or open 'Vos enjeux' and 'Méthode'; hover 'IA' for the ring)">
          <NavbarBar scrolled={false} items={sampleMenu} />
        </Preview>
        <Preview label="Navbar panels, ROI page on (the 'Méthode' panel shows the ROI card)">
          <NavbarBar scrolled={false} items={sampleMenuWithRoi} />
        </Preview>
        <Preview label="Navbar panels, mobile, sample challenges" mobile>
          <NavbarBar scrolled={false} layout="mobile" items={sampleMenu} />
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
