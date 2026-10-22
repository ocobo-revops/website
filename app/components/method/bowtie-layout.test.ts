import { describe, expect, it } from 'vitest';

import {
  BOWTIE_VIEWBOX,
  FLOW_LINES,
  columnSlice,
  flowPath,
} from './bowtie-layout';

describe('FLOW_LINES', () => {
  it('draws as many lines above the knot as below it', () => {
    const middle = BOWTIE_VIEWBOX.height / 2;
    const above = FLOW_LINES.filter((line) => line.edgeY < middle);
    expect(above).toHaveLength(FLOW_LINES.length / 2);
  });

  it('brings every line closer to the centre at the knot', () => {
    const middle = BOWTIE_VIEWBOX.height / 2;
    for (const line of FLOW_LINES) {
      expect(Math.abs(line.knotY - middle)).toBeLessThan(
        Math.abs(line.edgeY - middle),
      );
    }
  });
});

describe('flowPath', () => {
  it('starts and ends at the edge height, through the knot', () => {
    expect(flowPath({ edgeY: 22, knotY: 123.5 })).toBe(
      'M0,22 C240,22 330,123.5 450,123.5 L550,123.5 C670,123.5 760,22 1000,22',
    );
  });
});

describe('columnSlice', () => {
  it('shifts a full-width copy of the drawing under each column', () => {
    expect(columnSlice(0, 7)).toEqual({ width: '700%', left: '0%' });
    expect(columnSlice(3, 7)).toEqual({ width: '700%', left: '-300%' });
  });
});
