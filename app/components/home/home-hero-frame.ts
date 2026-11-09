// Geometry and timeline of the home hero visual: four teams converge on the
// RevOps axis, then the growth curve rises above it. Pure functions, so the
// server render, the reduced motion render and every animation frame share
// one source.
//
// The SVG is drawn on a 1100 × 360 grid. Time is in seconds from the start.

export const VIEWBOX = { width: 1100, height: 360 } as const;

/** Left and right ends of the axis and of the curve. */
export const AXIS_START = 40;
export const AXIS_END = 1060;
const AXIS_SPAN = AXIS_END - AXIS_START;
/** Height of the RevOps axis. */
export const AXIS_Y = 250;

/** Horizontal place of each team, from Marketing to Finance. */
export const TEAM_X = [150, 400, 650, 900] as const;
/** Scattered height of each team before it joins the axis. */
const TEAM_START_Y = [118, 186, 100, 170] as const;

/** Number of moving dots: ten hand-offs between teams, then the flow. */
export const DOT_COUNT = 16;
const HANDOFF_COUNT = 10;
/** Hand-offs that drop between two teams, before the axis exists. */
const LOST_HANDOFFS = [1, 4, 7, 9];

/** Time at which every part has reached its place. */
export const SETTLE_TIME = 6.6;
/** The halo waits a beat after the mark lands, then pulses this often. */
const HALO_DELAY = 0.3;
const HALO_PERIOD = 3.2;

type TeamIndex = 0 | 1 | 2 | 3;

export type HeroFrame = {
  teams: readonly { y: number; opacity: number }[];
  /** Top of the vertical guide from each team to the curve. */
  guides: readonly { y2: number; opacity: number }[];
  /** The point where each guide meets the curve. */
  nodes: readonly { cy: number; opacity: number }[];
  /** The gain label beside each node, lifted by `dy` while it appears. */
  gains: readonly { dy: number; opacity: number }[];
  axis: { x2: number; opacity: number };
  baseOpacity: number;
  axisLabelOpacity: number;
  gridOpacity: number;
  /** Share of the curve still hidden, from 1 (none drawn) to 0. */
  curveOffset: number;
  /** Width of the area under the curve that is shown. */
  clipWidth: number;
  ghostOpacity: number;
  end: { opacity: number; scale: number };
  /** True once the Ocobo mark has landed. */
  endReached: boolean;
  /** The ring that pulses around the mark once it has landed. */
  halo: { scale: number; opacity: number };
  /** Progress of the headline accents, from 0 to 1. */
  accents: { strike: number; tag: number; highlight: number };
  dots: readonly HeroDot[];
};

export type HeroDot = {
  x: number;
  y: number;
  r: number;
  opacity: number;
  /** A team's index while it hands work to the next one, else `axis`. */
  tone: TeamIndex | 'axis';
};

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Progress of `t` between `from` and `to`, from 0 to 1. */
function segment(t: number, from: number, to: number) {
  return clamp01((t - from) / (to - from));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function easeIn(t: number) {
  return t * t * t;
}

/** Height of the growth curve at `x`: flat at Marketing, steep at the end. */
export function curveY(x: number) {
  const u = (x - TEAM_X[0]) / (AXIS_END - TEAM_X[0]);
  return 175 - 25 * u - (u > 0 ? 110 * u ** 1.6 : 0);
}

/** The curve as an SVG polyline, from the start to the end of the axis. */
export const CURVE_POINTS: readonly (readonly [number, number])[] = (() => {
  const points: [number, number][] = [];
  // Every 11 units before Marketing, then 48 samples up to the end.
  for (let x = AXIS_START; x < TEAM_X[0]; x += 11) {
    points.push([x, curveY(TEAM_X[0]) + 3 * (1 - (x - AXIS_START) / 110)]);
  }
  const steps = 48;
  for (let i = 0; i <= steps; i += 1) {
    const x = TEAM_X[0] + ((AXIS_END - TEAM_X[0]) * i) / steps;
    points.push([x, curveY(x)]);
  }
  return points;
})();

export const CURVE_PATH = CURVE_POINTS.map(
  ([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`,
).join(' ');

export const AREA_PATH = `${CURVE_PATH} L${AXIS_END},${AXIS_Y} L${AXIS_START},${AXIS_Y} Z`;

/** Where the curve ends: the Ocobo mark sits there. */
export const CURVE_END = {
  x: AXIS_END,
  y: CURVE_POINTS[CURVE_POINTS.length - 1]?.[1] ?? 40,
} as const;

/** Resting place of each gain label: just above its node, on the left. */
export const GAIN_ANCHORS = TEAM_X.map((x) => ({ x, y: curveY(x) }));

function handoffDot(t: number, k: number): HeroDot {
  const team = (k % 3) as 0 | 1 | 2;
  const start = 0.75 + k * 0.15;
  const lost = LOST_HANDOFFS.includes(k);
  const ax = TEAM_X[team] + 14;
  const ay = TEAM_START_Y[team];
  const bx = TEAM_X[team + 1] - 14;
  const by = TEAM_START_Y[team + 1];
  const mx = (ax + bx) / 2;
  const my = Math.min(ay, by) - 70;
  const p = lost
    ? 0.55 * easeOut(segment(t, start, start + 0.55))
    : easeInOut(segment(t, start, start + 0.85));
  const u = 1 - p;
  let x = u * u * ax + 2 * u * p * mx + p * p * bx;
  let y = u * u * ay + 2 * u * p * my + p * p * by;
  let opacity: number;
  if (lost) {
    const fall = easeIn(segment(t, start + 0.45, start + 1.15));
    y += 140 * fall;
    x += 12 * fall;
    opacity =
      segment(t, start, start + 0.1) *
      (1 - segment(t, start + 0.8, start + 1.15));
  } else {
    opacity =
      segment(t, start, start + 0.1) *
      (1 - segment(t, start + 0.72, start + 0.85));
  }
  return { x, y, r: 3, opacity, tone: team };
}

function flowDot(t: number, k: number, axisEnd: number): HeroDot {
  const elapsed = t - 3 - k * 0.55;
  if (elapsed <= 0) return hiddenDot('axis');
  const along = (elapsed * 140) % AXIS_SPAN;
  const x = AXIS_START + along;
  const opacity =
    x > axisEnd
      ? 0
      : Math.min(1, elapsed * 2) *
        segment(along, 0, 40) *
        (1 - segment(along, AXIS_SPAN - 60, AXIS_SPAN)) *
        0.45;
  return { x, y: AXIS_Y, r: 2.6, opacity, tone: 'axis' };
}

function haloAt(t: number) {
  const elapsed = t - SETTLE_TIME - HALO_DELAY;
  if (elapsed < 0) return { scale: 0.6, opacity: 0 };
  const phase = (elapsed % HALO_PERIOD) / HALO_PERIOD;
  // Fades in over the first tenth of the pulse while it grows, then out.
  const opacity = phase < 0.1 ? 0.8 * (phase / 0.1) : 0.8 * ((1 - phase) / 0.9);
  return { scale: 0.6 + 2.2 * easeOut(phase), opacity };
}

function hiddenDot(tone: HeroDot['tone']): HeroDot {
  return { x: -50, y: -50, r: 3, opacity: 0, tone };
}

/**
 * Every animated value at time `t`. Before `SETTLE_TIME` the teams arrive
 * and converge, then the curve draws; after it, only the dots keep flowing
 * along the axis.
 */
export function heroFrame(t: number): HeroFrame {
  const axisEnd = AXIS_START + AXIS_SPAN * easeInOut(segment(t, 2.3, 3.5));
  // Progress of the second act: guides, nodes, gains, curve, mark.
  const growth = segment(t, 3.6, SETTLE_TIME);

  const teams = TEAM_X.map((x, i) => {
    const arrival = easeOut(segment(t, 0.1 + i * 0.18, 0.75 + i * 0.18));
    const aligned = easeInOut(segment(axisEnd, x - 80, x + 140));
    const bob = (1 - aligned) * 4 * Math.sin(t * 1.5 + i * 1.7);
    const startY = TEAM_START_Y[i as TeamIndex];
    const y = startY + (AXIS_Y - startY) * aligned + bob + (1 - arrival) * 12;
    return { y, opacity: arrival };
  });

  const guideProgress = TEAM_X.map((_, i) =>
    easeInOut(segment(growth, 0.05 + i * 0.16, 0.3 + i * 0.16)),
  );

  const guides = TEAM_X.map((x, i) => {
    const g = guideProgress[i] ?? 0;
    const top = AXIS_Y - 8 + (curveY(x) + 5 - (AXIS_Y - 8)) * g;
    return { y2: top, opacity: g > 0.01 ? 1 : 0 };
  });

  const nodes = guides.map((guide, i) => {
    const g = guideProgress[i] ?? 0;
    return {
      cy: guide.y2 - 6 * g,
      opacity: easeOut(segment(g, 0.6, 1)),
    };
  });

  const gains = guideProgress.map((g) => {
    const shown = easeOut(segment(g, 0.7, 1));
    return { dy: 8 * (1 - shown), opacity: shown };
  });

  const curve = easeInOut(segment(growth, 0.64, 0.95));
  const ghost = easeInOut(segment(growth, 0.8, 1));
  const end = easeOut(segment(growth, 0.93, 1));

  const dots = Array.from({ length: DOT_COUNT }, (_, k) => {
    if (k < HANDOFF_COUNT && t < 3.1) return handoffDot(t, k);
    if (t > 3) return flowDot(t, k, axisEnd);
    return hiddenDot('axis');
  });

  return {
    teams,
    guides,
    nodes,
    gains,
    axis: { x2: axisEnd, opacity: t > 2.3 ? 1 : 0 },
    baseOpacity: easeInOut(segment(t, 2.1, 2.6)),
    axisLabelOpacity: easeInOut(segment(t, 3.3, 3.8)),
    gridOpacity: easeInOut(segment(growth, 0, 0.3)),
    curveOffset: 1 - curve,
    clipWidth: AXIS_SPAN * curve,
    ghostOpacity: ghost,
    end: { opacity: end, scale: 0.4 + 0.6 * end },
    endReached: end > 0.98,
    halo: haloAt(t),
    accents: {
      strike: easeInOut(segment(t, 0.7, 1.25)),
      tag: easeOut(segment(t, 1.15, 1.7)),
      highlight: easeInOut(segment(t, 1.3, 2.1)),
    },
    dots,
  };
}

/**
 * The finished picture: every part in place, no dot moving. The server
 * render, a page without JavaScript and reduced motion all show it.
 */
export const SETTLED_FRAME: HeroFrame = {
  ...heroFrame(SETTLE_TIME),
  dots: Array.from({ length: DOT_COUNT }, () => hiddenDot('axis')),
};
