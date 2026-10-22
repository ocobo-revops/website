import type { StageId } from '~/modules/bowtie-stages';

/**
 * Geometry of the bow tie drawing, in the units of its 1200 by 350 viewBox.
 * The two funnels meet on the knot, which holds the closing stage.
 */
export const BOWTIE_VIEWBOX = { width: 1200, height: 350 } as const;

type Box = { x: number; y: number; width: number; height: number };

type TextAnchor = 'start' | 'middle' | 'end';

export type StageLayout = {
  /** Centre of the stage label. */
  labelX: number;
  /** Where the stage's Milestone sits in the flow row under the funnels. */
  milestone: { x: number; y: number; anchor: TextAnchor; dx?: number };
  /** Outline of the stage's slice of a funnel, as SVG polygon points. */
  slice: string;
  /** Area covered by the stage's tooltip trigger. */
  hitBox: Box;
};

const FUNNEL = {
  outerX: 40,
  innerX: 540,
  outerTop: 60,
  outerBottom: 290,
  innerTop: 140,
  innerBottom: 210,
};

// The right funnel mirrors the left one around the centre of the viewBox.
const mirror = (x: number) => BOWTIE_VIEWBOX.width - x;

// Top edge of the left funnel at `x`; the bottom edge is its mirror image.
function funnelTop(x: number): number {
  const progress = (x - FUNNEL.outerX) / (FUNNEL.innerX - FUNNEL.outerX);
  return FUNNEL.outerTop + (FUNNEL.innerTop - FUNNEL.outerTop) * progress;
}

function funnelBottom(x: number): number {
  return BOWTIE_VIEWBOX.height - funnelTop(x);
}

// Slice of the left funnel between `outerX` and `innerX`, mirrored when the
// stage sits on the right.
function funnelStage(
  outerX: number,
  innerX: number,
  side: 'left' | 'right',
  milestone: StageLayout['milestone'],
): StageLayout {
  const place = side === 'left' ? (x: number) => x : mirror;
  const points: Array<[number, number]> = [
    [place(outerX), funnelTop(outerX)],
    [place(innerX), funnelTop(innerX)],
    [place(innerX), funnelBottom(innerX)],
    [place(outerX), funnelBottom(outerX)],
  ];
  const left = Math.min(place(outerX), place(innerX));
  return {
    labelX: (place(outerX) + place(innerX)) / 2,
    milestone,
    slice: points.map(([x, y]) => `${x},${y}`).join(' '),
    hitBox: {
      x: left,
      y: funnelTop(outerX),
      width: innerX - outerX,
      height: funnelBottom(outerX) - funnelTop(outerX),
    },
  };
}

/** The knot rectangle, shared by the closing stage and its trigger. */
export const KNOT = { x: 540, y: 125, width: 120, height: 100 } as const;

// Stage boundaries keep the dashed guide lines of the drawing: 206 and 373 on
// the left, mirrored at 826 and 993 on the right.
export const STAGE_LAYOUT: Record<StageId, StageLayout> = {
  'demand-generation': funnelStage(40, 206, 'left', {
    x: 40,
    y: 240,
    anchor: 'start',
    dx: 5,
  }),
  discovery: funnelStage(206, 373, 'left', {
    x: 206,
    y: 220,
    anchor: 'middle',
  }),
  negotiation: funnelStage(373, 540, 'left', {
    x: 373,
    y: 200,
    anchor: 'middle',
  }),
  closing: {
    labelX: KNOT.x + KNOT.width / 2,
    milestone: { x: KNOT.x + KNOT.width / 2, y: 177, anchor: 'middle' },
    slice: '',
    hitBox: KNOT,
  },
  onboarding: funnelStage(373, 540, 'right', {
    x: 826,
    y: 200,
    anchor: 'middle',
  }),
  adoption: funnelStage(206, 373, 'right', {
    x: 993,
    y: 220,
    anchor: 'middle',
  }),
  expansion: funnelStage(40, 206, 'right', {
    x: 1160,
    y: 240,
    anchor: 'end',
    dx: -5,
  }),
};

/** A box in viewBox units as CSS percentages of the drawing. */
export function toPercentBox(box: Box) {
  const pct = (value: number, total: number) =>
    `${Math.round((value / total) * 10000) / 100}%`;
  return {
    left: pct(box.x, BOWTIE_VIEWBOX.width),
    top: pct(box.y, BOWTIE_VIEWBOX.height),
    width: pct(box.width, BOWTIE_VIEWBOX.width),
    height: pct(box.height, BOWTIE_VIEWBOX.height),
  };
}

/**
 * Splits a label over two lines when it is longer than `maxChars`, at the
 * space closest to its middle. The SVG has no text wrapping.
 */
export function splitLabel(label: string, maxChars: number): string[] {
  if (label.length <= maxChars) return [label];
  const middle = label.length / 2;
  let best = -1;
  for (let i = 0; i < label.length; i++) {
    if (label[i] !== ' ') continue;
    if (best === -1 || Math.abs(i - middle) < Math.abs(best - middle)) {
      best = i;
    }
  }
  if (best === -1) return [label];
  return [label.slice(0, best), label.slice(best + 1)];
}
