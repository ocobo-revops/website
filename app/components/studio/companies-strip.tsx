import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import {
  MarqueePauseButton,
  MarqueeTrack,
  marqueeEdgeFade,
  marqueeHoverPause,
  marqueeWrapWhenStill,
} from './studio-marquee';

type Company = {
  name: string;
  /** Trimmed logo, 96px high, under `public/images/companies/`. */
  logo: string;
  /** Intrinsic width of the file, so the track keeps its length on load. */
  width: number;
};

const LOGO_HEIGHT = 96;

/**
 * Former employers of the team, in mockup order. Logos supplied by Ocobo
 * (Slack, 2026-11-17). Trustpair and Yousign, in the mockup, had no logo.
 */
const COMPANIES: readonly Company[] = [
  { name: 'Deliveroo', logo: '/images/companies/deliveroo.webp', width: 360 },
  { name: 'SumUp', logo: '/images/companies/sumup.webp', width: 331 },
  { name: 'Qonto', logo: '/images/companies/qonto.webp', width: 336 },
  { name: 'PayFit', logo: '/images/companies/payfit.webp', width: 235 },
  { name: 'Doctolib', logo: '/images/companies/doctolib.webp', width: 396 },
  { name: 'Aviv Group', logo: '/images/companies/aviv-group.webp', width: 597 },
  { name: 'Mirakl', logo: '/images/companies/mirakl.webp', width: 484 },
  { name: 'Lucca', logo: '/images/companies/lucca.webp', width: 293 },
  { name: 'Zei', logo: '/images/companies/zei.webp', width: 205 },
  { name: 'TheFork', logo: '/images/companies/thefork.webp', width: 484 },
  { name: 'Spendesk', logo: '/images/companies/spendesk.webp', width: 582 },
  { name: 'YouTrust', logo: '/images/companies/youtrust.webp', width: 416 },
];

const strip = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '13rem minmax(0, 1fr) auto' },
  alignItems: 'center',
  gap: { base: '4', md: '8' },
});
// Rows only form under reduced motion, when the list wraps.
const logos = css({ display: 'flex', alignItems: 'center', rowGap: '6' });
const item = css({
  display: 'flex',
  alignItems: 'center',
  flex: 'none',
  px: '9',
  borderLeftWidth: '1px',
  borderColor: 'gray.200',
});
const logo = css({
  h: '7',
  w: 'auto',
  maxW: '[11rem]',
  objectFit: 'contain',
  filter: 'auto',
  grayscale: '1',
  opacity: '0.6',
});

/**
 * "Before Ocobo, we worked at": the label on the left, then the logos of
 * the team's former employers on one scrolling line, with a pause button.
 */
export function CompaniesStrip() {
  const { t } = useTranslation('studio');
  const [paused, setPaused] = React.useState(false);
  const labelId = React.useId();
  const renderLogos = (className: string, hidden = false) => (
    <ul aria-hidden={hidden || undefined} className={className}>
      {COMPANIES.map((company) => (
        <li key={company.name} className={item}>
          <img
            src={company.logo}
            alt={hidden ? '' : company.name}
            width={company.width}
            height={LOGO_HEIGHT}
            className={logo}
            // Eager: lazy copies outside the mask would pop in while scrolling.
            decoding="async"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-labelledby={labelId}
      className={css({
        py: '8',
        // The mockup keeps white space before the dark stats band.
        mb: { base: '16', md: '20' },
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: 'line',
      })}
    >
      <Container className={strip}>
        <p
          id={labelId}
          className={cx(
            text({ variant: 'small', color: 'muted' }),
            css({ fontWeight: 'semibold' }),
          )}
        >
          {t('companies.label')}
        </p>
        <div className={cx(marqueeEdgeFade, marqueeHoverPause)}>
          <MarqueeTrack
            direction="left"
            paused={paused}
            renderCopy={({ hidden, className }) =>
              renderLogos(cx(logos, marqueeWrapWhenStill, className), hidden)
            }
          />
        </div>
        <MarqueePauseButton
          paused={paused}
          onToggle={() => setPaused((value) => !value)}
          iconOnly
          labels={{
            pause: t('companies.pause'),
            play: t('companies.play'),
          }}
          className={css({ justifySelf: 'start' })}
        />
      </Container>
    </section>
  );
}
