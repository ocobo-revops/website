import { memo, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import {
  AREA_PATH,
  AXIS_END,
  AXIS_START,
  AXIS_Y,
  CURVE_END,
  CURVE_PATH,
  GAIN_ANCHORS,
  GAIN_X,
  type HeroDot,
  type HeroFrame,
  TEAM_X,
  VIEWBOX,
} from './home-hero-frame';

// Static classes per team: Panda only extracts literal values (CLAUDE.md §7).
const teamFill = [
  css({ fill: 'yellow' }),
  css({ fill: 'mint' }),
  css({ fill: 'sky' }),
  css({ fill: 'coral' }),
] as const;

const dotFill: Record<HeroDot['tone'], string> = {
  0: css({ fill: 'yellow.dark' }),
  1: css({ fill: 'mint.dark' }),
  2: css({ fill: 'sky.dark' }),
  3: css({ fill: 'coral.dark' }),
  axis: css({ fill: 'dark' }),
};

const svgStyles = css({
  display: 'block',
  w: 'full',
  h: 'auto',
  overflow: 'visible',
  fontFamily: 'body',
});

const gridLine = css({
  stroke: 'line',
  strokeWidth: '1',
  strokeDasharray: '2 5',
});

const baseLine = css({ stroke: 'gray.200', strokeWidth: '1' });

const ghostLine = css({
  stroke: 'gray.300',
  strokeWidth: '1.4',
  strokeDasharray: '3 5',
  strokeLinecap: 'round',
});

const guideLine = css({
  stroke: 'dark',
  strokeOpacity: '0.16',
  strokeWidth: '1',
});

// Small uppercase labels of the axis, hidden on a phone where they would be
// too small to read.
const axisLabel = css({
  display: { base: 'none', md: 'inline' },
  fontSize: '[10px]',
  fontWeight: 'bold',
  letterSpacing: '[1.6px]',
  textTransform: 'uppercase',
  fill: 'gray.400',
});

const teamDot = css({
  stroke: 'white',
  strokeWidth: '3',
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transform: { base: 'scale(1.35)', md: 'none' },
});

// SVG units: 30 on a phone reads like the 14 of a desktop.
const teamLabel = css({
  fontSize: { base: '[30px]', md: '[14px]' },
  fontWeight: 'medium',
  fill: 'dark',
});

const gainGroup = css({ display: { base: 'none', md: 'inline' } });
const gainNumber = css({
  fontSize: '[10px]',
  fontWeight: 'semibold',
  letterSpacing: '[.14em]',
  fill: 'gray.400',
});
const gainLabel = css({
  fontSize: '[13.5px]',
  fontWeight: 'semibold',
  fill: 'dark',
});

const aiLabel = cx(teamLabel, css({ fontWeight: 'bold' }));

const aiRing = css({
  strokeWidth: '1.6',
  strokeDasharray: '3 3',
  transformBox: 'fill-box',
  transformOrigin: 'center',
});

const node = css({
  fill: 'white',
  stroke: 'dark',
  strokeWidth: '1.6',
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transitionProperty: 'common',
  transitionDuration: 'fast',
  _motionReduce: { transitionDuration: 'instant' },
});

// Hovering a gain shows its tooltip, grows its node and dims the other
// gains, as in the mockup. Static selectors per gain: Panda extracts
// literals only (CLAUDE.md §7).
const GAIN_CLASS = [
  'hero-gain-1',
  'hero-gain-2',
  'hero-gain-3',
  'hero-gain-4',
  'hero-gain-5',
] as const;
const NODE_CLASS = [
  'hero-node-1',
  'hero-node-2',
  'hero-node-3',
  'hero-node-4',
  'hero-node-5',
] as const;
const TIP_CLASS = [
  'hero-tip-1',
  'hero-tip-2',
  'hero-tip-3',
  'hero-tip-4',
  'hero-tip-5',
] as const;
const grownNode = { transform: 'scale(1.6)', fill: 'dark' } as const;
const shownTip = { opacity: '1' } as const;

const visualFrame = css({
  position: 'relative',
  '&:has(.hero-gain-1:hover) .hero-node-1': grownNode,
  '&:has(.hero-gain-2:hover) .hero-node-2': grownNode,
  '&:has(.hero-gain-3:hover) .hero-node-3': grownNode,
  '&:has(.hero-gain-4:hover) .hero-node-4': grownNode,
  '&:has(.hero-gain-5:hover) .hero-node-5': grownNode,
  '&:has(.hero-gain-1:hover) .hero-tip-1': shownTip,
  '&:has(.hero-gain-2:hover) .hero-tip-2': shownTip,
  '&:has(.hero-gain-3:hover) .hero-tip-3': shownTip,
  '&:has(.hero-gain-4:hover) .hero-tip-4': shownTip,
  '&:has(.hero-gain-5:hover) .hero-tip-5': shownTip,
  '&:has(.hero-hit:hover) .hero-gain:not(:hover) text': {
    fillOpacity: '0.3',
  },
});

const gainHit = css({ fill: 'transparent' });

// Hover only, hidden on a phone as in the mockup. Screen readers get the
// same texts from the hidden list next to the visual.
const tip = cx(
  text({ variant: 'small', color: 'white' }),
  css({
    display: { base: 'none', md: 'block' },
    position: 'absolute',
    zIndex: '6',
    pointerEvents: 'none',
    w: '60',
    bg: 'dark',
    px: '3',
    py: '2.5',
    rounded: 'lg',
    shadow: 'hover',
    opacity: '0',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _motionReduce: { transitionDuration: 'instant' },
  }),
);
// The last two open to the left, to stay inside the frame.
const tipToRight = css({ transform: 'translate(14px, 14px)' });
const tipToLeft = css({ transform: 'translate(calc(-100% - 14px), 14px)' });
const tipLabel = cx(
  text({ variant: 'label' }),
  css({ display: 'block', mb: '1', color: 'coral' }),
);

const scalesFromCentre = css({
  transformBox: 'fill-box',
  transformOrigin: 'center',
});

// The gains below the visual on a phone, where the SVG labels are hidden.
const mobileGains = css({
  display: { base: 'grid', md: 'none' },
  gridTemplateColumns: '1fr 1fr',
  gap: '2',
  columnGap: '4',
  mt: '5',
  fontWeight: 'bold',
  color: 'dark',
  '& li': { display: 'flex', alignItems: 'center', gap: '2' },
  '& li::before': {
    content: '""',
    w: '2',
    h: '2',
    flexShrink: '0',
    rounded: 'full',
    bg: 'yellow',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'dark',
  },
});

const OCOBO_O_LEFT =
  'm208.88,207.17c10.64-11.77,23.8-21.1,39.13-27.72,12.09-5.21,25.51-8.33,39.96-9.46-14.55-5.19-30.4-7.95-47.73-7.95-20.21,0-38.55,3.53-54.96,10.6-16.43,7.08-30.33,16.95-41.69,29.57-11.37,12.64-20.09,27.29-26.16,43.97-6.06,16.68-9.09,34.61-9.09,53.82s3.03,36.52,9.09,53.45c6.06,16.93,14.79,31.58,26.16,43.95,11.37,12.39,25.27,22.26,41.69,29.57,16.41,7.34,34.75,10.98,54.96,10.98,17.41,0,33.22-2.78,47.64-8.04-14.11-1.2-27.85-4.38-39.79-9.72-15.38-6.85-28.59-16.21-39.24-27.82-10.66-11.6-18.94-25.54-24.61-41.42-5.77-16.1-8.69-33.24-8.69-50.96s2.91-35.46,8.67-51.29c5.69-15.67,13.99-29.65,24.67-41.54Z';
const OCOBO_O_RIGHT =
  'm477.89,226.4c-9.23-23.36-22.26-43.91-38.7-61.13-16.54-17.33-36.85-31.29-60.4-41.48-23.55-10.23-50.05-15.4-78.74-15.4-20.09,0-39.11,2.63-56.95,7.54,26.65.33,51,5.14,72.94,14.66,22.74,9.84,42.08,23.13,57.99,39.8,15.93,16.68,28.3,36.27,37.16,58.74,8.42,21.45,12.72,44.2,13.11,68.18.01.92.22,1.78.22,2.7,0,4.86-.25,9.64-.69,14.36-1.36,21.12-5.71,41.02-13.42,59.55-9.34,22.49-22.24,41.95-38.64,58.37-16.45,16.43-35.9,29.19-58.37,38.28-21.48,8.68-44.71,13.09-69.62,13.49,17.75,4.98,36.58,7.57,56.27,7.57,27.08,0,52.64-4.77,75.94-14.19,23.3-9.42,43.76-22.85,60.84-39.92,17.04-17.04,30.58-37.51,40.25-60.77,9.67-23.28,14.57-48.86,14.57-76s-4.63-51.02-13.76-74.36Z';

const GRID_Y = [70, 130, 190] as const;
const MARK_RADIUS = 17;

/** A missing translation array comes back as its key: show nothing then. */
function asList(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}

type SceneIds = Record<
  | 'axis'
  | 'fill'
  | 'vignette'
  | 'mask'
  | 'pattern'
  | 'shadow'
  | 'blur'
  | 'halo'
  | 'clip',
  string
>;

type SceneCopy = {
  teams: string[];
  agents: string;
  gains: string[];
  axis: string;
  withoutSystem: string;
};

type SceneProps = { frame: HeroFrame; ids: SceneIds; copy: SceneCopy };

/**
 * Skips a still layer when only the moving parts changed: past the settle
 * time `heroFrame` keeps every other field's reference.
 */
function sameScene(before: SceneProps, after: SceneProps) {
  if (before.ids !== after.ids || before.copy !== after.copy) return false;
  return (Object.keys(after.frame) as (keyof HeroFrame)[]).every(
    (key) =>
      key === 'dots' ||
      key === 'halo' ||
      before.frame[key] === after.frame[key],
  );
}

/** Background, axis and labels: under the moving dots. */
const BackLayer = memo(function BackLayer({ frame, ids, copy }: SceneProps) {
  return (
    <>
      <defs>
        <linearGradient
          id={ids.axis}
          gradientUnits="userSpaceOnUse"
          x1={TEAM_X[0]}
          y1="0"
          x2="1000"
          y2="0"
        >
          <stop offset="0" stopColor="var(--colors-yellow)" />
          <stop offset=".35" stopColor="var(--colors-mint)" />
          <stop offset=".68" stopColor="var(--colors-sky)" />
          <stop offset="1" stopColor="var(--colors-coral)" />
        </linearGradient>
        <linearGradient id={ids.fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--colors-dark)" stopOpacity=".035" />
          <stop offset="1" stopColor="var(--colors-dark)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={ids.vignette} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="white" />
          <stop offset=".7" stopColor="white" stopOpacity=".5" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={ids.mask}>
          <rect
            width={VIEWBOX.width}
            height={VIEWBOX.height}
            fill={`url(#${ids.vignette})`}
          />
        </mask>
        <pattern
          id={ids.pattern}
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="var(--colors-gray-200)" />
        </pattern>
        <filter id={ids.shadow} x="-20%" y="-40%" width="140%" height="200%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            floodColor="var(--colors-dark)"
            floodOpacity=".07"
          />
        </filter>
        <filter id={ids.blur} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <linearGradient id={ids.halo} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--colors-coral)" />
          <stop offset="1" stopColor="var(--colors-yellow)" />
        </linearGradient>
        <clipPath id={ids.clip}>
          <rect
            x={AXIS_START}
            y="0"
            width={frame.clipWidth}
            height={VIEWBOX.height}
          />
        </clipPath>
      </defs>

      <rect
        width={VIEWBOX.width}
        height={VIEWBOX.height}
        fill={`url(#${ids.pattern})`}
        mask={`url(#${ids.mask})`}
      />
      <g opacity={frame.gridOpacity}>
        {GRID_Y.map((y) => (
          <line
            key={y}
            className={gridLine}
            x1={AXIS_START}
            y1={y}
            x2={AXIS_END}
            y2={y}
          />
        ))}
      </g>
      <path
        d={AREA_PATH}
        clipPath={`url(#${ids.clip})`}
        fill={`url(#${ids.fill})`}
      />
      <line
        className={baseLine}
        x1={AXIS_START}
        y1={AXIS_Y}
        x2={AXIS_END}
        y2={AXIS_Y}
        opacity={frame.baseOpacity}
      />
      <line
        x1={AXIS_START}
        y1={AXIS_Y}
        x2={frame.axis.x2}
        y2={AXIS_Y}
        stroke={`url(#${ids.axis})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={frame.axis.opacity}
      />
      <path
        className={ghostLine}
        d={`M${AXIS_START},${AXIS_Y} C300,247 600,238 ${AXIS_END},222`}
        opacity={frame.ghostOpacity}
      />
      <text
        className={axisLabel}
        x={AXIS_END}
        y="212"
        textAnchor="end"
        opacity={frame.ghostOpacity}
      >
        {copy.withoutSystem}
      </text>
      <text
        className={axisLabel}
        x={AXIS_END}
        y="280"
        textAnchor="end"
        opacity={frame.axisLabelOpacity}
      >
        {copy.axis}
      </text>
    </>
  );
}, sameScene);

/** Guides, curve, teams and nodes: over the dots, under the halo. */
const MiddleLayer = memo(function MiddleLayer({
  frame,
  ids,
  copy,
}: SceneProps) {
  return (
    <>
      {GAIN_X.map((x, i) => (
        <line
          key={x}
          className={guideLine}
          x1={x}
          y1={AXIS_Y - 8}
          x2={x}
          y2={frame.guides[i]?.y2}
          opacity={frame.guides[i]?.opacity}
        />
      ))}

      <path
        d={CURVE_PATH}
        clipPath={`url(#${ids.clip})`}
        stroke={`url(#${ids.axis})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeOpacity=".22"
        filter={`url(#${ids.blur})`}
      />
      <path
        d={CURVE_PATH}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={frame.curveOffset}
        stroke={`url(#${ids.axis})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {TEAM_X.map((x, i) => (
        <g
          key={x}
          transform={`translate(${x},${frame.teams[i]?.y ?? AXIS_Y})`}
          opacity={frame.teams[i]?.opacity}
        >
          <circle r="9" className={cx(teamDot, teamFill[i])} />
          <text y="30" textAnchor="middle" className={teamLabel}>
            {copy.teams[i]}
          </text>
        </g>
      ))}

      <g
        transform={`translate(${frame.ai.x},${frame.ai.y})`}
        opacity={frame.ai.opacity}
      >
        <circle
          className={aiRing}
          r="17"
          stroke={`url(#${ids.halo})`}
          opacity={frame.ai.ringOpacity}
          style={{ transform: `rotate(${frame.ai.ringRotation}deg)` }}
        />
        <circle r="9" className={teamDot} fill={`url(#${ids.halo})`} />
        <text y="30" textAnchor="middle" className={aiLabel}>
          {copy.agents}
        </text>
      </g>

      {GAIN_X.map((x, i) => (
        <circle
          key={x}
          className={cx(node, NODE_CLASS[i])}
          cx={x}
          cy={frame.nodes[i]?.cy}
          r="4"
          opacity={frame.nodes[i]?.opacity}
        />
      ))}
    </>
  );
}, sameScene);

/** The Ocobo mark and the gains: on top of everything. */
const FrontLayer = memo(function FrontLayer({ frame, ids, copy }: SceneProps) {
  return (
    <>
      <g
        className={scalesFromCentre}
        opacity={frame.end.opacity}
        style={{ transform: `scale(${frame.end.scale})` }}
      >
        <circle
          cx={CURVE_END.x}
          cy={CURVE_END.y}
          r={MARK_RADIUS}
          fill="white"
          filter={`url(#${ids.shadow})`}
        />
        <g
          transform={`translate(${CURVE_END.x - 14},${CURVE_END.y - 14}) scale(0.04667)`}
        >
          <circle cx="300" cy="300" r="298" fill="var(--colors-dark)" />
          <path d={OCOBO_O_LEFT} fill="white" />
          <path d={OCOBO_O_RIGHT} fill="white" />
        </g>
      </g>

      {GAIN_ANCHORS.map(({ x, y }, i) => (
        <g
          key={x}
          className={cx(gainGroup, 'hero-gain', GAIN_CLASS[i])}
          transform={`translate(${x},${y + (frame.gains[i]?.dy ?? 0)})`}
          opacity={frame.gains[i]?.opacity}
        >
          <rect
            className={cx(gainHit, 'hero-hit')}
            // Above the curve only, so a node never opens its neighbour.
            x="-215"
            y="-46"
            width="221"
            height="46"
            // No hover before the gain has appeared.
            style={{
              pointerEvents:
                (frame.gains[i]?.opacity ?? 0) > 0.5 ? 'all' : 'none',
            }}
          />
          <text className={gainNumber} x="-6" y="-26" textAnchor="end">
            {String(i + 1).padStart(2, '0')}
          </text>
          <text className={gainLabel} x="-6" y="-10" textAnchor="end">
            {copy.gains[i]}
          </text>
        </g>
      ))}
    </>
  );
}, sameScene);

type HomeHeroVisualProps = { frame: HeroFrame };

/**
 * The drawing of the home hero, for one frame of its timeline. The SVG is
 * hidden from assistive technologies: a visually hidden sentence describes
 * it, gains included. Once settled, only the dots and the halo render on
 * each frame; the still layers are memoised.
 */
export function HomeHeroVisual({ frame }: HomeHeroVisualProps) {
  const { t } = useTranslation('home');
  const id = useId();
  const ids = useMemo<SceneIds>(
    () => ({
      axis: `${id}-axis`,
      fill: `${id}-fill`,
      vignette: `${id}-vignette`,
      mask: `${id}-mask`,
      pattern: `${id}-pattern`,
      shadow: `${id}-shadow`,
      blur: `${id}-blur`,
      halo: `${id}-halo`,
      clip: `${id}-clip`,
    }),
    [id],
  );
  const copy = useMemo<SceneCopy>(
    () => ({
      teams: asList(t('heroV2.teams', { returnObjects: true })),
      agents: t('heroV2.agents'),
      gains: asList(t('heroV2.gains', { returnObjects: true })),
      axis: t('heroV2.axis'),
      withoutSystem: t('heroV2.withoutSystem'),
    }),
    [t],
  );

  const tips = useMemo(
    () => asList(t('heroV2.tips', { returnObjects: true })),
    [t],
  );

  return (
    <div>
      <p className={css({ srOnly: true })}>{t('heroV2.visualLabel')}</p>
      <ul className={css({ srOnly: true })}>
        {tips.map((tipText, i) => (
          <li key={tipText}>
            {copy.gains[i]}. {tipText}
          </li>
        ))}
      </ul>
      <div className={visualFrame}>
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          fill="none"
          className={svgStyles}
        >
          <BackLayer frame={frame} ids={ids} copy={copy} />
          <g>
            {frame.dots.map((dot, i) => (
              <circle
                // The dots are a fixed pool, recycled from frame to frame.
                key={i}
                className={dotFill[dot.tone]}
                cx={dot.x}
                cy={dot.y}
                r={dot.r}
                opacity={dot.opacity}
              />
            ))}
          </g>
          <MiddleLayer frame={frame} ids={ids} copy={copy} />
          <circle
            className={scalesFromCentre}
            cx={CURVE_END.x}
            cy={CURVE_END.y}
            r={MARK_RADIUS}
            stroke={`url(#${ids.halo})`}
            strokeWidth="1.8"
            opacity={frame.halo.opacity}
            style={{ transform: `scale(${frame.halo.scale})` }}
          />
          <FrontLayer frame={frame} ids={ids} copy={copy} />
        </svg>
        {GAIN_ANCHORS.map(({ x, y }, i) =>
          tips[i] ? (
            <span
              key={x}
              aria-hidden="true"
              className={cx(tip, i < 3 ? tipToRight : tipToLeft, TIP_CLASS[i])}
              style={{
                left: `${(x / VIEWBOX.width) * 100}%`,
                top: `${(y / VIEWBOX.height) * 100}%`,
              }}
            >
              <b className={tipLabel}>{t('heroV2.tipLabel')}</b>
              {tips[i]}
            </span>
          ) : null,
        )}
      </div>
      {/* The hidden sentence above already reads these gains. */}
      <ul
        aria-hidden="true"
        className={cx(text({ variant: 'small' }), mobileGains)}
      >
        {copy.gains.map((gain) => (
          <li key={gain}>{gain}</li>
        ))}
      </ul>
    </div>
  );
}
