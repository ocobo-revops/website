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

/**
 * Below this many companies, one copy is narrower than the column and the
 * loop shows a gap: the names then sit in a static row.
 */
const MARQUEE_MIN_COMPANIES = 6;

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
const staticNames = css({ display: 'flex', flexWrap: 'wrap', rowGap: '3' });
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
  const labelId = React.useId();
  if (companies.length === 0) return null;
  const scrolls = companies.length >= MARQUEE_MIN_COMPANIES;
  const renderNames = (className: string, hidden = false) => (
    <ul aria-hidden={hidden || undefined} className={className}>
      {companies.map((company) => (
        <li key={company} className={name}>
          {company}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-labelledby={labelId}
      className={css({
        py: '8',
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
        {scrolls ? (
          <>
            <div className={cx(marqueeEdgeFade, marqueeHoverPause)}>
              <MarqueeTrack
                direction="left"
                paused={paused}
                renderCopy={({ hidden, className }) =>
                  renderNames(
                    cx(names, marqueeWrapWhenStill, className),
                    hidden,
                  )
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
          </>
        ) : (
          renderNames(staticNames)
        )}
      </Container>
    </section>
  );
}
