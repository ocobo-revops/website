import { ArrowRight, Pause, Play } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { SETTLED_FRAME, heroFrame } from './home-hero-frame';
import { HomeHeroVisual } from './home-hero-visual';
import { useHeroTimeline } from './use-hero-timeline';

// A faint yellow glow rising from the bottom edge.
const glow = css({
  position: 'relative',
  overflow: 'hidden',
  bgImage:
    '[radial-gradient(60% 50% at 50% 100%, color-mix(in srgb, var(--colors-yellow) 10%, transparent), transparent 70%)]',
});

const title = cx(
  text({ variant: 'display-xl' }),
  css({ maxW: '[18em]', mx: 'auto', mb: '6', textWrap: 'balance' }),
);

const subtitle = cx(
  text({ variant: 'body' }),
  css({ maxW: '2xl', mx: 'auto', mb: '8', color: 'gray' }),
);

const struck = css({
  position: 'relative',
  textDecoration: 'none',
  color: 'gray',
  whiteSpace: 'nowrap',
  // Forced colours drop the coral bar: fall back to the native strike.
  _highContrast: { textDecoration: 'line-through' },
});

const strikeLine = css({
  position: 'absolute',
  left: '[-2%]',
  right: '[-2%]',
  top: '[44%]',
  h: '[0.085em]',
  rounded: 'full',
  bg: 'coral',
  transformOrigin: 'left center',
  _highContrast: { display: 'none' },
});

const tag = css({
  display: 'inline-block',
  ml: '[0.04em]',
  px: '[0.2em]',
  pt: '[0.02em]',
  pb: '[0.08em]',
  rounded: 'lg',
  bg: 'mint',
  color: 'dark',
});

const highlight = css({
  fontWeight: 'bold',
  color: 'dark',
  px: '[0.08em]',
  bgImage:
    '[linear-gradient(90deg, color-mix(in srgb, var(--colors-yellow) 55%, transparent), color-mix(in srgb, var(--colors-yellow) 55%, transparent))]',
  bgRepeat: 'no-repeat',
  bgPosition: '[0 88%]',
});

const actions = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3',
  justifyContent: 'center',
});

const frameStyles = css({
  maxW: '[1180px]',
  mx: 'auto',
  mt: { base: '10', md: '14' },
  textAlign: 'left',
});

const pauseStyles = cx(
  button({ variant: 'secondary', size: 'sm' }),
  css({
    display: 'flex',
    ml: 'auto',
    mt: '4',
    // Rendered from the server on, then hidden by CSS under reduced motion.
    _motionReduce: { display: 'none' },
  }),
);

const iconSize = css({ w: '4', h: '4' });

type HeroCopyProps = {
  titleAs: 'h1' | 'h2';
  strike: number;
  tag: number;
  highlight: number;
};

/**
 * The headline and subtitle. Memoised on the accent progress, so the text
 * stops rendering once the accents have settled while the visual moves on.
 */
const HeroCopy = memo(function HeroCopy({
  titleAs: Title,
  strike,
  tag: tagIn,
  highlight: highlightIn,
}: HeroCopyProps) {
  const { t } = useTranslation('home');
  // Keep the punctuation that follows the tag on its line.
  const after = t('heroV2.title.after');
  const glue = after.match(/^\S*/)?.[0] ?? '';

  return (
    <>
      <Title className={title}>
        {t('heroV2.title.before')}{' '}
        <del className={struck}>
          {t('heroV2.title.struck')}
          {/* Screen readers rarely announce a deletion: say it. */}
          <span className={css({ srOnly: true })}>
            {' '}
            {t('heroV2.title.struckSr')}
          </span>
          <span
            aria-hidden="true"
            className={strikeLine}
            style={{ transform: `scaleX(${strike})` }}
          />
        </del>{' '}
        <span className={css({ whiteSpace: 'nowrap' })}>
          <span
            className={tag}
            style={{
              opacity: tagIn,
              transform: `rotate(${-12 + 9.5 * tagIn}deg) scale(${0.6 + 0.4 * tagIn})`,
            }}
          >
            {t('heroV2.title.accent')}
          </span>
          {glue}
        </span>
        {after.slice(glue.length)}
      </Title>
      <p className={subtitle}>
        {t('heroV2.subtitle.before')}{' '}
        <strong
          className={highlight}
          style={{ backgroundSize: `${highlightIn * 100}% 0.32em` }}
        >
          {t('heroV2.subtitle.highlight')}
        </strong>
        {t('heroV2.subtitle.after')}
      </p>
    </>
  );
});

type HomeHeroProps = {
  /** `h2` where the page already has its `h1`, as on the design system. */
  titleAs?: 'h1' | 'h2';
};

/**
 * The v2 home hero: the promise, two calls to action, and four teams that
 * converge on the RevOps axis while growth rises above it.
 *
 * The visual plays once on reveal, then its flow keeps moving along the
 * axis, so a visible button pauses it (WCAG 2.2.2). The server render and
 * reduced motion show the settled picture, without the button.
 */
export function HomeHero({ titleAs = 'h1' }: HomeHeroProps) {
  const { t } = useTranslation('home');
  const { ref, time, paused, togglePaused } = useHeroTimeline();
  const frame = time === null ? SETTLED_FRAME : heroFrame(time);
  const PauseIcon = paused ? Play : Pause;

  return (
    <header
      ref={ref}
      className={cx(section({ bg: 'white', padding: 'lg' }), glow)}
    >
      <Container className={css({ textAlign: 'center' })}>
        <HeroCopy titleAs={titleAs} {...frame.accents} />
        <div className={actions}>
          <a href="#enjeux" className={button({ variant: 'secondary' })}>
            {t('heroV2.cta.challenges')}
          </a>
          <a href="#diagnostic" className={button({ variant: 'primary' })}>
            {t('heroV2.cta.diagnostic')}
            <ArrowRight className={iconSize} aria-hidden="true" />
          </a>
        </div>
        <div className={frameStyles}>
          <HomeHeroVisual frame={frame} />
          <button
            type="button"
            className={pauseStyles}
            onClick={togglePaused}
            // Kept in the layout, hidden until the clock runs.
            style={time === null ? { visibility: 'hidden' } : undefined}
          >
            <PauseIcon className={iconSize} aria-hidden="true" />
            {paused ? t('heroV2.play') : t('heroV2.pause')}
          </button>
        </div>
      </Container>
    </header>
  );
}
