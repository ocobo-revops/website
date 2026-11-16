import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, card, section, text } from '@ocobo/styled-system/recipes';

import { UnifiedBowtie } from '~/components/method/unified-bowtie';
import { Container } from '~/components/ui/Container';
import type { HomeChallengeCard } from '~/modules/home-challenges';

import { HomeChallengeCards } from './home-challenge-cards';

/** Target of the final call to action, which the start panel links to. */
export const DIAGNOSTIC_ID = 'diagnostic';

/** Target of the hero's "challenges" call to action. */
export const CHALLENGES_ID = 'enjeux';

const subtitle = cx(
  text({ variant: 'body' }),
  css({ maxW: '2xl', mx: 'auto', color: 'gray', textAlign: 'center' }),
);

const startPanel = cx(
  card({ shadow: 'none', padding: 'xl', border: false }),
  // The mockup panel sits on the section grey, darker than `tone: 'tinted'`.
  css({
    mt: '10',
    bg: 'gray.light',
    flexDirection: { base: 'column', md: 'row' },
    flexWrap: 'wrap',
    gap: '6',
    alignItems: { base: 'flex-start', md: 'center' },
    justifyContent: 'space-between',
  }),
);

// Light coral as in the mockup (prototype PR 31): about 2:1 on white, below
// the 3:1 of large text. Waits for Ocobo's approval; `coral.dark` passes.
const titleAccent = css({ color: 'coral', fontStyle: 'italic' });

type ChallengesSectionProps = {
  challenges: HomeChallengeCard[];
};

/**
 * The challenges block of the v2 home (`#enjeux` in the mockup): the revenue
 * bow tie over the seven stages, then one flip card per challenge.
 */
export function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const { t } = useTranslation('home');

  return (
    <section
      id={CHALLENGES_ID}
      className={cx(
        section({ bg: 'white', padding: 'lg' }),
        css({ scrollMarginTop: '24' }),
      )}
    >
      <Container>
        <h2
          className={cx(
            text({ variant: 'display-lg' }),
            css({ mb: '4', textAlign: 'center' }),
          )}
        >
          <Trans
            i18nKey="challenges.title"
            t={t}
            components={[<em key="accent" className={titleAccent} />]}
          />
        </h2>
        <p className={subtitle}>{t('challenges.subtitle')}</p>
        <div className={css({ mb: { base: '12', md: '6' } })}>
          <UnifiedBowtie />
        </div>
        <HomeChallengeCards challenges={challenges} />
        <div className={startPanel}>
          <div className={css({ flex: '1', maxW: 'xl' })}>
            <h3
              className={cx(
                text({ variant: 'display-md-bold' }),
                css({ mb: '2' }),
              )}
            >
              {t('challenges.start.title')}
            </h3>
            <p className={text({ variant: 'body', color: 'muted' })}>
              {t('challenges.start.text')}
            </p>
          </div>
          <a
            href={`#${DIAGNOSTIC_ID}`}
            className={button({ variant: 'primary', size: 'md' })}
          >
            {t('challenges.start.cta')}
          </a>
        </div>
      </Container>
    </section>
  );
}
