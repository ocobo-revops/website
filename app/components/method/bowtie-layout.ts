/**
 * Geometry of the flow bow tie, in the units of its 1000 by 260 viewBox. The
 * SVG stretches to its box (`preserveAspectRatio="none"`), so every stage
 * column is a seventh of the width.
 */
export const BOWTIE_VIEWBOX = { width: 1000, height: 260 } as const;

export type FlowLine = {
  /** Height of the line at both outer edges. */
  edgeY: number;
  /** Height of the line where it runs through the knot. */
  knotY: number;
};

// Eight lines, four above and four below the knot. They converge on a narrow
// band around the vertical centre, then fan out again.
export const FLOW_LINES: readonly FlowLine[] = [
  { edgeY: 22, knotY: 123.5 },
  { edgeY: 50, knotY: 125.2 },
  { edgeY: 78, knotY: 126.9 },
  { edgeY: 106, knotY: 128.6 },
  { edgeY: 154, knotY: 131.4 },
  { edgeY: 182, knotY: 133.1 },
  { edgeY: 210, knotY: 134.8 },
  { edgeY: 238, knotY: 136.5 },
];

// The knot runs flat between these two x values.
const KNOT_START = 450;
const KNOT_END = 550;

/**
 * SVG path of one flow line: a curve into the knot, a flat run through it,
 * and the mirror curve out of it.
 */
export function flowPath({ edgeY, knotY }: FlowLine): string {
  const { width } = BOWTIE_VIEWBOX;
  return [
    `M0,${edgeY}`,
    `C240,${edgeY} 330,${knotY} ${KNOT_START},${knotY}`,
    `L${KNOT_END},${knotY}`,
    `C670,${knotY} 760,${edgeY} ${width},${edgeY}`,
  ].join(' ');
}

/**
 * Places a full-width copy of the drawing inside the column of the stage at
 * `index`, so that the column clips out its own seventh.
 */
export function columnSlice(index: number, columns: number) {
  return { width: `${columns * 100}%`, left: `${-index * 100}%` };
}
