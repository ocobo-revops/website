import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { UnifiedBowtie } from '~/components/method/unified-bowtie';
import { Container } from '~/components/ui/Container';
import type { HomeChallengeCard } from '~/modules/home-challenges';

import { HomeChallengeCards } from './home-challenge-cards';

/** Target of the hero's "challenges" call to action. */
export const CHALLENGES_ID = 'enjeux';

const subtitle = cx(
  text({ variant: 'body' }),
  css({ maxW: '2xl', mx: 'auto', color: 'gray', textAlign: 'center' }),
);

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
        section({ bg: 'gray', padding: 'lg' }),
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
          {t('challenges.title')}
        </h2>
        <p className={subtitle}>{t('challenges.subtitle')}</p>
        <div className={css({ mb: { base: '12', md: '6' } })}>
          <UnifiedBowtie />
        </div>
        <HomeChallengeCards challenges={challenges} />
      </Container>
    </section>
  );
}
