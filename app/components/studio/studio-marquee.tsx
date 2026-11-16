import { Pause, Play } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button } from '@ocobo/styled-system/recipes';

/** Copies per track: the `marquee-ultra-slow` keyframes move by a third. */
const COPIES = [0, 1, 2] as const;

const TRACK_CLASS = 'studio-marquee-track';

const track = css({
  display: 'flex',
  w: 'max',
  animation: 'marquee-ultra-slow',
  // No motion: the one visible copy fits the width and wraps.
  _motionReduce: { animation: '[none]', w: 'full' },
});
// Static literals per direction and state: Panda drops runtime values.
const directionStyles = {
  left: css({ animationDirection: 'normal' }),
  right: css({ animationDirection: 'reverse' }),
} as const;
const pausedStyle = css({ animationPlayState: 'paused' });
// Without motion, one copy is enough.
const extraCopy = css({ _motionReduce: { display: 'none' } });

/**
 * Goes on the element around one or more tracks: hovering it, or focusing
 * inside it, pauses them while the user reads.
 */
export const marqueeHoverPause = css({
  [`&:hover .${TRACK_CLASS}, &:focus-within .${TRACK_CLASS}`]: {
    animationPlayState: 'paused',
  },
});

/** Fades both ends of a marquee row, except under reduced motion. */
export const marqueeEdgeFade = css({
  overflow: 'hidden',
  maskImage:
    '[linear-gradient(90deg, transparent 0, black 8%, black 92%, transparent 100%)]',
  _motionReduce: { maskImage: '[none]' },
});

/**
 * Goes on the list inside a track: under reduced motion, its items wrap so
 * that none is clipped.
 */
export const marqueeWrapWhenStill = css({
  _motionReduce: { flexWrap: 'wrap', justifyContent: 'center' },
});

type MarqueeTrackProps = {
  direction: 'left' | 'right';
  paused: boolean;
  /**
   * Renders one copy of the content. The copies after the first are hidden
   * from assistive tech and under reduced motion: they take `className`.
   */
  renderCopy: (copy: {
    hidden: boolean;
    className?: string;
  }) => React.ReactNode;
};

/** One row that scrolls without end, left or right. */
export function MarqueeTrack({
  direction,
  paused,
  renderCopy,
}: MarqueeTrackProps) {
  return (
    <div
      className={cx(
        TRACK_CLASS,
        track,
        directionStyles[direction],
        paused && pausedStyle,
      )}
    >
      {COPIES.map((copy) => (
        <React.Fragment key={copy}>
          {copy === 0
            ? renderCopy({ hidden: false })
            : renderCopy({ hidden: true, className: extraCopy })}
        </React.Fragment>
      ))}
    </div>
  );
}

const pauseStyles = cx(
  button({ variant: 'secondary', size: 'sm' }),
  css({
    display: 'flex',
    // Rendered from the server on, then hidden by CSS under reduced motion.
    _motionReduce: { display: 'none' },
  }),
);
const iconOnlyStyles = css({ px: '2.5' });
const iconSize = css({ w: '4', h: '4' });
const srOnly = css({ srOnly: true });

type MarqueePauseButtonProps = {
  paused: boolean;
  onToggle: () => void;
  /** Keeps the label for assistive tech only. */
  iconOnly?: boolean;
  /**
   * Names the marquee, when the page has more than one, so that each
   * button has its own name.
   */
  labels?: { pause: string; play: string };
  className?: string;
};

/**
 * Pauses and resumes a marquee that moves for more than five seconds
 * (WCAG 2.2.2), as on the home hero.
 */
export function MarqueePauseButton({
  paused,
  onToggle,
  iconOnly = false,
  labels,
  className,
}: MarqueePauseButtonProps) {
  const { t } = useTranslation('studio');
  const Icon = paused ? Play : Pause;
  const { pause, play } = labels ?? {
    pause: t('marquee.pause'),
    play: t('marquee.play'),
  };
  const label = paused ? play : pause;

  return (
    <button
      type="button"
      className={cx(pauseStyles, iconOnly && iconOnlyStyles, className)}
      onClick={onToggle}
    >
      <Icon className={iconSize} aria-hidden="true" />
      <span className={iconOnly ? srOnly : undefined}>{label}</span>
    </button>
  );
}
