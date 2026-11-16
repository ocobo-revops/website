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
} from './studio-marquee';

type CompaniesStripProps = {
  /** Previous companies of the team, from the member files. */
  companies: string[];
};

const strip = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '13rem minmax(0, 1fr) auto' },
  alignItems: 'center',
  gap: { base: '4', md: '8' },
});
const names = css({ display: 'flex' });
const name = cx(
  text({ variant: 'display-md-black' }),
  css({
    px: '9',
    color: 'gray.400',
    whiteSpace: 'nowrap',
    borderLeftWidth: '1px',
    borderColor: 'gray.200',
  }),
);

/**
 * "Before Ocobo, we worked at": the label on the left, then the team's
 * previous companies on one scrolling line, with a pause button.
 */
export function CompaniesStrip({ companies }: CompaniesStripProps) {
  const { t } = useTranslation('studio');
  const [paused, setPaused] = React.useState(false);
  if (companies.length === 0) return null;

  return (
    <section
      aria-label={t('companies.label')}
      className={css({
        py: '8',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderColor: 'line',
      })}
    >
      <Container className={strip}>
        <p
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
            renderCopy={({ hidden, className }) => (
              <ul
                aria-hidden={hidden || undefined}
                className={cx(names, className)}
              >
                {companies.map((company) => (
                  <li key={company} className={name}>
                    {company}
                  </li>
                ))}
              </ul>
            )}
          />
        </div>
        <MarqueePauseButton
          paused={paused}
          onToggle={() => setPaused((value) => !value)}
          iconOnly
          className={css({ justifySelf: 'start' })}
        />
      </Container>
    </section>
  );
}
