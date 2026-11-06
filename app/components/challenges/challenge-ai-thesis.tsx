import {
  FileSpreadsheet,
  FileText,
  Folder,
  MessageSquare,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import {
  badge,
  button,
  card,
  section,
  text,
} from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import {
  matchesReducedMotion,
  usePrefersReducedMotion,
} from '~/hooks/use-prefers-reduced-motion';

// useLayoutEffect warns on the server; it never runs there anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;
const LAST_STEP = STEP_KEYS.length - 1;
/** Time each step stays on screen, in milliseconds. */
export const STEP_DURATIONS = [3500, 3000, 3500, 5000] as const;

// The stage is drawn on a 1000 × 560 grid. Positions are percentages of it,
// so the SVG lines and the boxes share one frame.
type Tile = {
  id: string;
  logo?: string;
  icon?: 'folder' | 'chat';
  /** Scattered position, then the place in its block. */
  from: { x: number; y: number; rotate: number };
  to: { x: number; y: number };
};

const TILES: readonly Tile[] = [
  {
    id: 'hubspot',
    logo: '/logos/hubspot.png',
    from: { x: 8, y: 10.71, rotate: -8 },
    to: { x: 8, y: 16.79 },
  },
  {
    id: 'clay',
    logo: '/images/partners/clay.png',
    from: { x: 26, y: 25, rotate: 6 },
    to: { x: 15.4, y: 16.79 },
  },
  {
    id: 'planhat',
    logo: '/images/partners/planhat.png',
    from: { x: 56, y: 75, rotate: -6 },
    to: { x: 22.8, y: 16.79 },
  },
  {
    id: 'hyperline',
    logo: '/images/partners/hyperline.png',
    from: { x: 30, y: 78.57, rotate: 12 },
    to: { x: 30.2, y: 16.79 },
  },
  {
    id: 'notion',
    logo: '/images/partners/notion.png',
    from: { x: 64, y: 58.93, rotate: -10 },
    to: { x: 8, y: 48.04 },
  },
  {
    id: 'modjo',
    logo: '/images/partners/modjo.jpeg',
    from: { x: 47, y: 8.93, rotate: -4 },
    to: { x: 15.4, y: 48.04 },
  },
  {
    id: 'aircall',
    logo: '/images/partners/aircall.png',
    from: { x: 12, y: 53.57, rotate: 10 },
    to: { x: 22.8, y: 48.04 },
  },
  {
    id: 'folder',
    icon: 'folder',
    from: { x: 3, y: 80.36, rotate: -6 },
    to: { x: 30.2, y: 48.04 },
  },
  {
    id: 'dust',
    logo: '/images/partners/dust.png',
    from: { x: 90, y: 12.5, rotate: 6 },
    to: { x: 8, y: 79.29 },
  },
  {
    id: 'lemlist',
    logo: '/images/partners/lemlist.webp',
    from: { x: 38, y: 46.43, rotate: -12 },
    to: { x: 15.4, y: 79.29 },
  },
  {
    id: 'qobra',
    logo: '/images/partners/qobra.png',
    from: { x: 60, y: 21.43, rotate: 8 },
    to: { x: 22.8, y: 79.29 },
  },
  {
    id: 'chat',
    icon: 'chat',
    from: { x: 92, y: 76.79, rotate: 10 },
    to: { x: 30.2, y: 79.29 },
  },
];

const FILES = [
  { key: 'pipe', icon: 'sheet', x: 19, y: 38.39, rotate: -14 },
  { key: 'export', icon: 'sheet', x: 47, y: 29.46, rotate: 10 },
  { key: 'process', icon: 'file', x: 70, y: 7.14, rotate: -8 },
  { key: 'wiki', icon: 'file', x: 43, y: 83.93, rotate: 6 },
] as const;

const GROUPS = [
  { key: 'foundation', y: 5.36 },
  { key: 'context', y: 36.61 },
  { key: 'activation', y: 67.86 },
] as const;

// From the centre of the AI node to the tools it cannot reach.
const BAD_LINE_ENDS = [
  [627, 147],
  [667, 357],
  [407, 287],
  [927, 97],
  [947, 457],
] as const;
const NODE_CENTRE = [830, 280] as const;

const GOOD_PATHS = [
  'M600 105 C 690 105, 680 280, 755 280',
  'M600 280 C 690 280, 680 280, 755 280',
  'M600 455 C 690 455, 680 280, 755 280',
];

// Text scales with the stage, within readable bounds.
const stageText = css({
  fontSize: '[clamp(0.5625rem, 1.45cqw, 0.875rem)]',
  lineHeight: 'tight',
});

// Shared by every moving part; added once the loop runs, so the reset to the
// first step before it happens in one frame.
const moving = css({
  transitionProperty: '[opacity, transform, left, top, background-color]',
  transitionDuration: '[900ms]',
  transitionTimingFunction: 'smooth',
  _motionReduce: { transitionDuration: 'instant' },
});

const shown = css({ opacity: '1' });
const hidden = css({ opacity: '0' });

const tileStyles = css({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '[5.4cqw]',
  h: '[5.4cqw]',
  p: '[0.9cqw]',
  bg: 'white',
  color: 'gray.700',
  rounded: 'lg',
  shadow: 'rest',
});

const fileStyles = css({
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '[0.6cqw]',
  px: '[1cqw]',
  py: '[0.6cqw]',
  bg: 'white',
  color: 'gray.700',
  rounded: 'lg',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
  whiteSpace: 'nowrap',
});

// Struck out at once, then gone after a beat.
const fileGone = css({
  opacity: '0',
  textDecoration: 'line-through',
  textDecorationColor: 'coral.dark',
  transitionDelay: '[700ms]',
});

const groupStyles = css({
  position: 'absolute',
  left: '[4%]',
  w: '[56%]',
  h: '[26.8%]',
  px: '[1.2cqw]',
  py: '[0.9cqw]',
  bg: 'gray.50',
  rounded: 'xl',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
});

const chipStyles = css({
  position: 'absolute',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '[0.6cqw]',
  px: '[1.2cqw]',
  py: '[0.6cqw]',
  bg: 'white',
  color: 'mint.dark',
  fontWeight: 'semibold',
  rounded: 'full',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'mint',
  whiteSpace: 'nowrap',
});

const chipPlaces = {
  answers: css({ left: '[72%]', top: '[16%]' }),
  actions: css({ left: '[70%]', top: '[79%]' }),
};

const chipDelay = css({ transitionDelay: '[700ms]' });

const nodeFace = css({
  position: 'absolute',
  inset: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '[0.5cqw]',
  rounded: 'full',
  fontWeight: 'semibold',
  textAlign: 'center',
});

const stepNumber = css({ fontVariantNumeric: 'tabular-nums' });

const stepStyles = {
  current: css({ color: 'dark', borderColor: 'dark' }),
  other: css({ color: 'gray', borderColor: 'line' }),
};

const pauseStyles = css({
  alignSelf: 'flex-start',
  // Rendered from the server on, then hidden by CSS under reduced motion.
  _motionReduce: { display: 'none' },
});

const iconSize = css({ w: '4', h: '4' });

function isAboveFold(element: Element): boolean {
  return element.getBoundingClientRect().top < window.innerHeight;
}

/**
 * Drives the four steps. The server, a page without JavaScript and a visitor
 * who reduces motion get the last step, the finished picture. Otherwise the
 * stage goes back to the first step before the visitor scrolls to it, and
 * plays while it is on screen. A stage already on screen at load starts from
 * the last step, so it never jumps under the visitor's eyes.
 */
function useThesisSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState<number>(LAST_STEP);
  const [visible, setVisible] = useState(false);
  const [armed, setArmed] = useState(false);
  const [paused, setPaused] = useState(false);
  const canAnimate =
    !reducedMotion && typeof IntersectionObserver !== 'undefined';

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || !canAnimate || matchesReducedMotion()) {
      setStep(LAST_STEP);
      setArmed(false);
      return;
    }
    if (!isAboveFold(element)) setStep(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry?.isIntersecting ?? false;
        setVisible(isVisible);
        if (isVisible) setArmed(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [canAnimate]);

  const playing = canAnimate && armed && visible && !paused;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % STEP_KEYS.length),
      STEP_DURATIONS[step],
    );
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  return {
    ref,
    step,
    armed: canAnimate && armed,
    paused,
    togglePaused: () => setPaused((current) => !current),
  };
}

function TileIcon({ tile }: { tile: Tile }) {
  if (tile.logo) {
    return (
      <img
        src={tile.logo}
        alt=""
        loading="lazy"
        decoding="async"
        className={css({ w: 'full', h: 'full', objectFit: 'contain' })}
      />
    );
  }
  const Icon = tile.icon === 'folder' ? Folder : MessageSquare;
  return <Icon className={css({ w: '[60%]', h: '[60%]' })} />;
}

type StageProps = { step: number; armed: boolean };

function Stage({ step, armed }: StageProps) {
  const { t } = useTranslation('challenges');
  const gradientId = useId();
  const motion = armed ? moving : undefined;
  const scattered = step === 0;
  const placed = step >= 2;
  const active = step === LAST_STEP;

  return (
    <div
      role="img"
      aria-label={t('aiThesis.stageLabel')}
      className={cx(
        stageText,
        css({
          position: 'relative',
          w: 'full',
          aspectRatio: '[1000 / 560]',
          containerType: 'inline-size',
          overflow: 'hidden',
          color: 'dark',
        }),
      )}
    >
      {/* Everything inside is a picture: the label above says it in words. */}
      <div aria-hidden="true">
        {GROUPS.map((group) => (
          <div
            key={group.key}
            className={cx(groupStyles, motion, placed ? shown : hidden)}
            style={{ top: `${group.y}%` }}
          >
            <span
              className={css({
                color: 'gray',
                fontWeight: 'semibold',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
              })}
            >
              {t(`aiThesis.group.${group.key}`)}
            </span>
          </div>
        ))}

        <svg
          viewBox="0 0 1000 560"
          className={css({
            position: 'absolute',
            inset: '0',
            w: 'full',
            h: 'full',
          })}
        >
          <defs>
            {/* User space units: the flat middle path has no height, so a
                bounding-box gradient would not paint it. */}
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1="600"
              x2="755"
              y1="0"
              y2="0"
            >
              <stop offset="0" stopColor="var(--colors-coral)" />
              <stop offset="1" stopColor="var(--colors-yellow)" />
            </linearGradient>
          </defs>
          <g className={cx(motion, scattered ? shown : hidden)}>
            {BAD_LINE_ENDS.map(([x, y]) => {
              const midX = (NODE_CENTRE[0] + x) / 2;
              const midY = (NODE_CENTRE[1] + y) / 2;
              return (
                <g key={`${x}-${y}`}>
                  <line
                    x1={NODE_CENTRE[0]}
                    y1={NODE_CENTRE[1]}
                    x2={x}
                    y2={y}
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className={css({ stroke: 'coral' })}
                  />
                  <path
                    d={`M${midX - 7} ${midY - 7} L${midX + 7} ${midY + 7} M${midX + 7} ${midY - 7} L${midX - 7} ${midY + 7}`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className={css({ stroke: 'coral.dark' })}
                  />
                </g>
              );
            })}
          </g>
          {GOOD_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="1"
              className={cx(
                armed
                  ? css({
                      transitionProperty: '[stroke-dashoffset]',
                      transitionDuration: '[1200ms]',
                      transitionTimingFunction: 'smooth',
                      _motionReduce: { transitionDuration: 'instant' },
                    })
                  : undefined,
              )}
              style={{ strokeDashoffset: active ? 0 : 1 }}
            />
          ))}
        </svg>

        {FILES.map((file) => {
          const Icon = file.icon === 'sheet' ? FileSpreadsheet : FileText;
          return (
            <span
              key={file.key}
              className={cx(fileStyles, motion, scattered ? shown : fileGone)}
              style={{
                left: `${file.x}%`,
                top: `${file.y}%`,
                transform: `rotate(${file.rotate}deg)`,
              }}
            >
              <Icon className={css({ w: '[1.6cqw]', h: '[1.6cqw]' })} />
              {t(`aiThesis.file.${file.key}`)}
            </span>
          );
        })}

        {TILES.map((tile) => {
          const position = placed ? tile.to : tile.from;
          const rotate = placed ? 0 : tile.from.rotate;
          return (
            <span
              key={tile.id}
              className={cx(tileStyles, motion)}
              // Data values: one position per tile and per step.
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: `rotate(${rotate}deg)`,
              }}
            >
              <TileIcon tile={tile} />
            </span>
          );
        })}

        <div
          className={css({
            position: 'absolute',
            left: '[75.5%]',
            top: '[36.6%]',
            w: '[15cqw]',
            h: '[15cqw]',
          })}
        >
          <span
            className={cx(
              nodeFace,
              motion,
              css({
                color: 'gray',
                bg: 'white',
                borderWidth: '2px',
                borderStyle: 'dashed',
                borderColor: 'gray.300',
              }),
              active ? hidden : shown,
            )}
          >
            <span className={css({ fontSize: '[3cqw]', lineHeight: 'none' })}>
              ?
            </span>
            {t('aiThesis.node')}
          </span>
          <span
            className={cx(
              nodeFace,
              motion,
              css({ color: 'white', bg: 'dark', shadow: 'window' }),
              active ? shown : hidden,
            )}
          >
            <Sparkles
              className={css({
                w: '[3cqw]',
                h: '[3cqw]',
                color: 'yellow',
              })}
            />
            {t('aiThesis.node')}
          </span>
        </div>

        <span
          className={cx(
            chipStyles,
            chipPlaces.answers,
            motion,
            active ? cx(shown, chipDelay) : hidden,
          )}
        >
          {t('aiThesis.chip.answers')}
        </span>
        <span
          className={cx(
            chipStyles,
            chipPlaces.actions,
            motion,
            active ? cx(shown, chipDelay) : hidden,
          )}
        >
          {t('aiThesis.chip.actions')}
        </span>
      </div>
    </div>
  );
}

/**
 * The Revenue AI thesis: why agents need a structured context, in four steps
 * drawn as a looping animation. A visible button pauses it (WCAG 2.2.2); it
 * holds still on the finished picture under reduced motion.
 */
export function ChallengeAiThesis() {
  const { t } = useTranslation('challenges');
  const { ref, step, armed, paused, togglePaused } = useThesisSteps();

  return (
    <section
      id="contexte"
      className={cx(
        section({ bg: 'gray' }),
        css({ position: 'relative', overflow: 'hidden' }),
      )}
    >
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          inset: '0',
          backgroundImage:
            '[radial-gradient(rgba(33,35,35,0.11) 1px, transparent 1.2px)]',
          backgroundSize: '[22px 22px]',
          maskImage:
            '[radial-gradient(ellipse at center, black, transparent 75%)]',
        })}
      />
      <Container className={css({ position: 'relative' })}>
        <div className={css({ maxW: '3xl', mb: { base: '10', lg: '14' } })}>
          <span
            className={cx(
              badge({ variant: 'ai', size: 'sm' }),
              css({ mb: '6' }),
            )}
          >
            {t('aiThesis.eyebrow')}
          </span>
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '6' }))}>
            {t('aiThesis.title')}
          </h2>
          <p
            className={cx(
              text({ variant: 'body', color: 'muted' }),
              css({ mb: '4' }),
            )}
          >
            {t('aiThesis.lead')}
          </p>
          <p
            className={cx(
              text({ variant: 'body' }),
              css({ fontWeight: 'semibold' }),
            )}
          >
            {t('aiThesis.conclusion')}
          </p>
        </div>

        <div
          ref={ref}
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              lg: 'minmax(0, 0.72fr) minmax(0, 2fr)',
            },
            gap: { base: '6', lg: '10' },
            alignItems: 'center',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              order: { base: '2', lg: '1' },
            })}
          >
            <ol
              aria-label={t('aiThesis.stepsLabel')}
              className={css({
                display: 'grid',
                gridTemplateColumns: {
                  base: 'repeat(2, minmax(0, 1fr))',
                  lg: '1fr',
                },
                gap: { base: '3', lg: '4' },
              })}
            >
              {STEP_KEYS.map((key, index) => {
                const current = index === step;
                return (
                  <li
                    key={key}
                    aria-current={current ? 'step' : undefined}
                    className={cx(
                      css({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1',
                        pl: '3',
                        borderLeftWidth: '2px',
                        borderLeftStyle: 'solid',
                        transition: 'colors',
                        transitionDuration: 'normal',
                        _motionReduce: { transitionDuration: 'instant' },
                      }),
                      current ? stepStyles.current : stepStyles.other,
                    )}
                  >
                    <p className={text({ variant: 'label' })}>
                      <span className={stepNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>{' '}
                      {t(`aiThesis.${key}.title`)}
                    </p>
                    <p
                      className={cx(
                        text({ variant: 'small' }),
                        css({ srOnly: { base: true, lg: false } }),
                      )}
                    >
                      {t(`aiThesis.${key}.text`)}
                    </p>
                  </li>
                );
              })}
            </ol>
            <div
              aria-hidden="true"
              className={css({
                h: '1',
                bg: 'line',
                rounded: 'full',
                overflow: 'hidden',
              })}
            >
              <div
                className={cx(
                  css({
                    h: 'full',
                    bgGradient: 'ai',
                    transformOrigin: 'left',
                  }),
                  armed ? moving : undefined,
                )}
                style={{
                  transform: `scaleX(${(step + 1) / STEP_KEYS.length})`,
                }}
              />
            </div>
            <button
              type="button"
              className={cx(
                button({ variant: 'secondary', size: 'sm' }),
                pauseStyles,
              )}
              onClick={togglePaused}
            >
              {paused ? (
                <Play aria-hidden className={iconSize} />
              ) : (
                <Pause aria-hidden className={iconSize} />
              )}
              {paused ? t('aiThesis.play') : t('aiThesis.pause')}
            </button>
          </div>

          <div
            className={cx(
              card({ padding: 'sm', radius: 'lg' }),
              css({ order: { base: '1', lg: '2' }, p: { md: '6' } }),
            )}
          >
            <Stage step={step} armed={armed} />
          </div>
        </div>
      </Container>
    </section>
  );
}
