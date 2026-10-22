import { describe, expect, it } from 'vitest';

import { STAGE_IDS } from '~/modules/bowtie-stages';

import { STAGE_LAYOUT, splitLabel, toPercentBox } from './bowtie-layout';

describe('splitLabel', () => {
  it('keeps a short label on one line', () => {
    expect(splitLabel('Négociation', 14)).toEqual(['Négociation']);
  });

  it('splits a long label at the space closest to its middle', () => {
    expect(splitLabel('Génération de demande', 14)).toEqual([
      'Génération',
      'de demande',
    ]);
    expect(splitLabel('Demand generation', 14)).toEqual([
      'Demand',
      'generation',
    ]);
  });

  it('keeps a long label without spaces on one line', () => {
    expect(splitLabel('Superlongstagename', 10)).toEqual([
      'Superlongstagename',
    ]);
  });
});

describe('STAGE_LAYOUT', () => {
  it('places the stages from left to right in bow tie order', () => {
    const xs = STAGE_IDS.map((id) => STAGE_LAYOUT[id].labelX);
    expect(xs).toEqual([...xs].sort((a, b) => a - b));
  });

  it('mirrors the right funnel around the knot', () => {
    expect(STAGE_LAYOUT.expansion.labelX).toBe(
      1200 - STAGE_LAYOUT['demand-generation'].labelX,
    );
    expect(STAGE_LAYOUT.adoption.hitBox.width).toBe(
      STAGE_LAYOUT.discovery.hitBox.width,
    );
  });
});

describe('toPercentBox', () => {
  it('converts viewBox units into percentages of the drawing', () => {
    expect(toPercentBox({ x: 600, y: 175, width: 120, height: 35 })).toEqual({
      left: '50%',
      top: '50%',
      width: '10%',
      height: '10%',
    });
  });
});
