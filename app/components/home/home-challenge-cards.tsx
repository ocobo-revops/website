import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { challengePalette } from '~/components/challenges/challenge-palette';
import { challengePill } from '~/components/challenges/challenge-pill';
import { FlipCard } from '~/components/ui/flip-card';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import {
  type HomeChallengeCard,
  challengeNumber,
} from '~/modules/home-challenges';

const list = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'minmax(0, 1fr)',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
  gap: '8',
});

// Each card sets `colorPalette` to its challenge (`challengePalette`).
const front = css({ p: '9' });
const back = css({ pt: '8', px: '8', pb: '7' });
// Display face through `text()`, at the 128px token nearest the
// prototype's 140px watermark.
const watermark = cx(
  text({ variant: 'display-lg' }),
  css({
    position: 'absolute',
    right: '5',
    bottom: '14',
    fontSize: '9xl',
    lineHeight: 'none',
    letterSpacing: 'tighter',
    color: 'colorPalette',
    opacity: '0.22',
    pointerEvents: 'none',
  }),
);
const aiWatermark = css({
  bgGradient: 'ai-text',
  bgClip: 'text',
  color: 'transparent',
});
const above = css({ position: 'relative' });
// Keeps the first line of a face clear of the flip button in the corner.
const clearOfButton = css({ pr: '12' });
const quote = cx(
  text({ variant: 'body' }),
  css({
    position: 'relative',
    flex: '1',
    mt: '4',
    fontStyle: 'italic',
    color: 'gray.700',
  }),
);
const frontFooter = cx(
  text({ variant: 'body' }),
  css({
    position: 'relative',
    mt: '6',
    pt: '4',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'line',
    fontWeight: 'semibold',
  }),
);
const band = css({
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  h: '1',
  bg: 'colorPalette',
});
const aiBand = css({ bgGradient: 'ai' });
const backLabel = cx(text({ variant: 'label' }), css({ color: 'gray.300' }));
const intro = cx(
  text({ variant: 'small' }),
  css({ mt: '2', color: 'gray.300' }),
);
const steps = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  mt: '4',
  flex: '1',
});
// `text()` defaults to dark: the back face is dark, so its copy is white.
// `small` is the nearest size to the prototype's 15px back copy.
const step = cx(
  text({ variant: 'small', color: 'white' }),
  css({
    display: 'grid',
    gridTemplateColumns: '1.75rem minmax(0, 1fr)',
    columnGap: '2.5',
    alignItems: 'baseline',
    fontWeight: 'semibold',
    lineHeight: 'snug',
  }),
);
const stepNumber = cx(
  text({ variant: 'display-lg' }),
  css({ fontSize: 'sm', lineHeight: 'snug', color: 'colorPalette' }),
);
// Sky reads at about 3.5:1 on the dark back: the systems number is lighter.
const syStepNumber = css({ color: 'gray.300' });
const backLink = cx(
  text({ variant: 'small', color: 'white' }),
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mt: '4',
    pt: '3.5',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    // Zinc 700 on the dark back reads as the prototype's 12% white rule.
    borderTopColor: 'gray.700',
    fontWeight: 'semibold',
    _hover: { '& svg': { transform: 'translateX(4px)' } },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'white',
      outlineOffset: '0.5',
    },
    '& svg': {
      w: '4.5',
      h: '4.5',
      transition: 'transform',
      transitionDuration: 'normal',
    },
  }),
);

type HomeChallengeCardsProps = {
  challenges: HomeChallengeCard[];
};

/**
 * Home challenge cards (#241). Each card is a `FlipCard`: the front shows
 * the challenge quote, the back its workstreams and the only link to the
 * challenge page, so a tap shows the back before any navigation.
 */
export function HomeChallengeCards({ challenges }: HomeChallengeCardsProps) {
  return (
    <ul className={list}>
      {challenges.map((challenge) => (
        <li key={challenge.slug} className={challengePalette[challenge.key]}>
          <ChallengeFlipCard challenge={challenge} />
        </li>
      ))}
    </ul>
  );
}

function ChallengeFlipCard({ challenge }: { challenge: HomeChallengeCard }) {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const number = challengeNumber(challenge.order);
  const title = challenge.tagline ?? challenge.name;
  const isAi = challenge.key === 'ai';

  return (
    <FlipCard
      size="lg"
      label={title}
      frontClassName={front}
      backClassName={back}
      front={
        <>
          <span
            aria-hidden="true"
            className={cx(watermark, isAi && aiWatermark)}
          >
            {number}
          </span>
          <span className={cx(above, challengePill[challenge.key])}>
            {t('challengeCards.number', { number })}
          </span>
          <h3
            className={cx(
              text({ variant: 'display-md-bold' }),
              above,
              clearOfButton,
              css({ mt: '7' }),
            )}
          >
            {title}
          </h3>
          {challenge.quote ? (
            <p className={quote}>
              {t('challengeCards.quote', {
                quote: challenge.quote,
                interpolation: { escapeValue: false },
              })}
            </p>
          ) : (
            <span className={css({ flex: '1' })} />
          )}
          {/* A hint, not a link: the link sits on the back. */}
          <span aria-hidden="true" className={frontFooter}>
            {t('challengeCards.link')}
          </span>
        </>
      }
      back={
        <>
          <span aria-hidden="true" className={cx(band, isAi && aiBand)} />
          <span className={cx(backLabel, clearOfButton)}>
            {t('challengeCards.backLabel', { number })}
          </span>
          {challenge.intro ? <p className={intro}>{challenge.intro}</p> : null}
          <ol className={steps}>
            {challenge.workstreams.map((workstream, index) => (
              <li key={`${index}-${workstream}`} className={step}>
                <span
                  className={cx(
                    stepNumber,
                    challenge.key === 'sy' && syStepNumber,
                  )}
                >
                  {challengeNumber(index + 1)}
                </span>
                <span>{workstream}</span>
              </li>
            ))}
          </ol>
          <Link
            to={getLocalizedPath(`/challenges/${challenge.slug}`)}
            className={backLink}
            // React escapes attributes; i18next escaping would show `&#39;`.
            aria-label={t('challengeCards.linkLabel', {
              name: challenge.name,
              interpolation: { escapeValue: false },
            })}
          >
            {t('challengeCards.link')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </>
      }
    />
  );
}
