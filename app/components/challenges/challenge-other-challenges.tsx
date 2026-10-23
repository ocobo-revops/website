import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { ChallengeMenuEntry } from '~/modules/challenge-menu';

import { challengePalette } from './challenge-palette';

const link = cx(
  card({ padding: 'md' }),
  css({
    h: 'full',
    gap: '2.5',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _hover: { transform: 'translateY(-4px)', boxShadow: 'hover' },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'dark',
      outlineOffset: '0.5',
    },
    _motionReduce: {
      transitionDuration: 'instant',
      _hover: { transform: 'none' },
    },
  }),
);

// Each card sets `colorPalette` to its own challenge (`challengePalette`).
const dot = css({
  flexShrink: '0',
  w: '2.5',
  h: '2.5',
  rounded: 'full',
  bg: 'colorPalette',
});
const aiDot = css({ bgGradient: 'ai' });

type ChallengeOtherChallengesProps = {
  challenges: ChallengeMenuEntry[];
};

export function ChallengeOtherChallenges({
  challenges,
}: ChallengeOtherChallengesProps) {
  const { t } = useTranslation('challenges');
  const getLocalizedPath = useLocalizedPathname();
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={section({ bg: 'gray', padding: 'md' })}
    >
      <Container>
        <h2
          id={titleId}
          className={cx(
            text({ variant: 'label' }),
            // The muted grey falls under 4.5:1 on the grey section.
            css({ color: 'gray.600', mb: '6' }),
          )}
        >
          {t('otherChallenges.title')}
        </h2>
        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '4',
          })}
        >
          {challenges.map((challenge) => (
            <li
              key={challenge.slug}
              className={challengePalette[challenge.key]}
            >
              <Link
                to={getLocalizedPath(`/challenges/${challenge.slug}`)}
                className={link}
              >
                <span
                  className={css({
                    display: 'flex',
                    gap: '2',
                    alignItems: 'center',
                  })}
                >
                  <span
                    aria-hidden="true"
                    className={cx(dot, challenge.key === 'ai' && aiDot)}
                  />
                  <span className={text({ variant: 'label', color: 'muted' })}>
                    {challenge.name}
                  </span>
                </span>
                {challenge.tagline ? (
                  <span
                    className={cx(
                      text({ variant: 'body' }),
                      css({ fontWeight: 'bold' }),
                    )}
                  >
                    {challenge.tagline}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
