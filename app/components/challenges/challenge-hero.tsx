import { ArrowRight } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, section, text } from '@ocobo/styled-system/recipes';

import { UnifiedBowtie } from '~/components/method/unified-bowtie';
import { Container } from '~/components/ui/Container';
import type { ChallengeHero as ChallengeHeroData } from '~/modules/challenge-page';
import type { ChallengeKey } from '~/modules/challenge-schema';

import { DIAGNOSTIC_ID } from './challenge-diagnostic';
import { WORKSTREAMS_ID } from './challenge-workstreams';

// The page root sets `colorPalette` to the challenge colour (route file).
const pill = cx(
  text({ variant: 'label' }),
  css({
    bg: 'colorPalette',
    color: 'dark',
    px: '4',
    py: '1.5',
    rounded: 'full',
  }),
);

const highlight = css({
  textDecorationLine: 'underline',
  textDecorationColor: 'colorPalette',
  textDecorationThickness: '3px',
  textUnderlineOffset: '6px',
});

type ChallengeHeroProps = {
  hero: ChallengeHeroData;
  challenge: ChallengeKey;
  name: string;
  order: number;
  /** Shows the CTA, which scrolls to the diagnostic block. */
  hasDiagnostic: boolean;
  /** Shows the secondary CTA, which scrolls to the workstreams. */
  hasWorkstreams: boolean;
};

export function ChallengeHero({
  hero,
  challenge,
  name,
  order,
  hasDiagnostic,
  hasWorkstreams,
}: ChallengeHeroProps) {
  const { t } = useTranslation('challenges');
  const titleId = useId();
  const showCta = hero.cta !== null && hasDiagnostic;

  return (
    <section
      aria-labelledby={titleId}
      className={section({ bg: 'white', padding: 'md' })}
    >
      <Container className={css({ textAlign: 'center' })}>
        <div className={css({ maxW: '4xl', mx: 'auto' })}>
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3',
              alignItems: 'center',
              justifyContent: 'center',
              mb: '10',
            })}
          >
            <span className={pill}>{name}</span>
            <span className={text({ variant: 'small', color: 'muted' })}>
              {t('hero.breadcrumb', { order: String(order).padStart(2, '0') })}
            </span>
          </div>

          <h1
            id={titleId}
            className={cx(text({ variant: 'display-xl' }), css({ mb: '8' }))}
          >
            {hero.title}
            {hero.titleMuted ? (
              <>
                <br />
                <span className={css({ color: 'gray' })}>
                  {hero.titleMuted}
                </span>
              </>
            ) : null}
          </h1>

          {hero.quote ? (
            <p
              className={cx(
                text({ variant: 'display-md-bold' }),
                css({ mb: '5' }),
              )}
            >
              {t('hero.quote', {
                quote: hero.quote,
                interpolation: { escapeValue: false },
              })}
            </p>
          ) : null}

          {hero.lead || hero.highlight ? (
            <p
              className={cx(
                text({ variant: 'body', color: 'muted' }),
                css({ maxW: '2xl', mx: 'auto', mb: '10' }),
              )}
            >
              {hero.lead}
              {hero.lead && hero.highlight ? ' ' : null}
              {hero.highlight ? (
                <span className={highlight}>{hero.highlight}</span>
              ) : null}
            </p>
          ) : null}

          {showCta || hasWorkstreams ? (
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3',
                justifyContent: 'center',
              })}
            >
              {showCta ? (
                <a
                  href={`#${DIAGNOSTIC_ID}`}
                  className={button({ variant: 'primary', size: 'lg' })}
                >
                  {hero.cta}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ) : null}
              {hasWorkstreams ? (
                <a
                  href={`#${WORKSTREAMS_ID}`}
                  className={button({ variant: 'secondary', size: 'lg' })}
                >
                  {t('hero.workstreamsCta')}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <figure
          className={css({
            mt: '20',
            mx: 'auto',
            // The bow tie has no mobile layout yet (`UnifiedBowtie`).
            display: { base: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: '4',
          })}
        >
          <p className={text({ variant: 'label', color: 'muted' })}>
            {t('hero.bowtieLabel')}
          </p>
          <UnifiedBowtie
            activeStages={hero.activeStages}
            challenge={challenge}
          />
          {hero.caption ? (
            <figcaption
              className={css({
                maxW: 'xl',
                mx: 'auto',
                fontStyle: 'italic',
                fontWeight: 'medium',
                color: 'gray',
                lineHeight: 'body',
              })}
            >
              {hero.caption}
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </section>
  );
}
