import { describe, expect, it } from 'vitest';
import {
  ROI_DEFAULT_INPUTS,
  ROI_INPUT_RANGES,
  ROI_SCENARIOS,
  clampRoiInput,
  computeRoi,
} from './roi';

describe('computeRoi', () => {
  it('computes the current funnel from the five inputs', () => {
    const { today } = computeRoi(ROI_DEFAULT_INPUTS, 'conservative');

    expect(today.oppsPerRepPerYear).toBe(120);
    expect(today.oppsPerYear).toBe(480);
    expect(today.deals).toBe(120);
    expect(today.booking).toBe(3_000_000);
    expect(today.contractValue).toBe(9_000_000);
  });

  it('applies the conservative levers to opportunities, win rate and deal value', () => {
    const { withRevops } = computeRoi(ROI_DEFAULT_INPUTS, 'conservative');

    expect(withRevops.reps).toBe(4);
    expect(withRevops.oppsPerRepPerMonth).toBeCloseTo(10.5);
    expect(withRevops.oppsPerRepPerYear).toBeCloseTo(126);
    expect(withRevops.oppsPerYear).toBeCloseTo(504);
    expect(withRevops.winRate).toBe(26);
    expect(withRevops.deals).toBeCloseTo(131.04);
    expect(withRevops.acv).toBeCloseTo(26_250);
    expect(withRevops.booking).toBeCloseTo(3_439_800);
    expect(withRevops.durationYears).toBe(3);
    expect(withRevops.contractValue).toBeCloseTo(10_319_400);
  });

  it('applies the ambitious levers', () => {
    const { withRevops } = computeRoi(ROI_DEFAULT_INPUTS, 'ambitious');

    expect(withRevops.oppsPerRepPerMonth).toBeCloseTo(11);
    expect(withRevops.winRate).toBe(28);
    expect(withRevops.acv).toBeCloseTo(27_500);
    // 4 x 11 x 12 x 28% x 27,500 = 4,065,600
    expect(withRevops.booking).toBeCloseTo(4_065_600);
  });

  it('reports the gain and the lever increments', () => {
    const result = computeRoi(ROI_DEFAULT_INPUTS, 'conservative');

    expect(result.gain.contractValue).toBeCloseTo(1_319_400);
    expect(result.gain.booking).toBeCloseTo(439_800);
    expect(result.levers.oppsPerRepPerMonth).toBeCloseTo(0.5);
    expect(result.levers.oppsPerRepPerYear).toBeCloseTo(6);
    expect(result.levers.winRatePoints).toBe(1);
    expect(result.levers.acv).toBeCloseTo(1_250);
  });

  it('reports the relative change of each computed row', () => {
    const { deltas } = computeRoi(ROI_DEFAULT_INPUTS, 'conservative');

    expect(deltas.oppsPerYear).toBeCloseTo(0.05);
    expect(deltas.deals).toBeCloseTo(0.092);
    expect(deltas.booking).toBeCloseTo(0.1466);
    expect(deltas.contractValue).toBeCloseTo(0.1466);
  });

  it('caps the improved win rate at 100', () => {
    const result = computeRoi(
      { ...ROI_DEFAULT_INPUTS, winRate: 99 },
      'ambitious',
    );

    expect(result.withRevops.winRate).toBe(100);
    expect(result.levers.winRatePoints).toBe(1);
  });

  it('returns zero deltas instead of NaN when the base row is zero', () => {
    const result = computeRoi(
      { ...ROI_DEFAULT_INPUTS, reps: 0 },
      'conservative',
    );

    expect(result.deltas.oppsPerYear).toBe(0);
    expect(result.deltas.contractValue).toBe(0);
  });
});

describe('ROI_SCENARIOS', () => {
  it('keeps the ambitious levers above the conservative ones', () => {
    const { conservative, ambitious } = ROI_SCENARIOS;

    expect(ambitious.oppsUplift).toBeGreaterThan(conservative.oppsUplift);
    expect(ambitious.winRatePoints).toBeGreaterThan(conservative.winRatePoints);
    expect(ambitious.acvUplift).toBeGreaterThan(conservative.acvUplift);
  });
});

describe('clampRoiInput', () => {
  it('keeps a value inside its range', () => {
    expect(clampRoiInput('reps', 12)).toBe(12);
  });

  it('clamps to the range bounds', () => {
    expect(clampRoiInput('reps', 0)).toBe(ROI_INPUT_RANGES.reps.min);
    expect(clampRoiInput('winRate', 95)).toBe(ROI_INPUT_RANGES.winRate.max);
  });

  it('snaps to the step', () => {
    expect(clampRoiInput('durationYears', 2.3)).toBe(2.5);
    expect(clampRoiInput('acv', 25_400)).toBe(25_000);
  });

  it('falls back to the default on a non-numeric value', () => {
    expect(clampRoiInput('reps', Number.NaN)).toBe(ROI_DEFAULT_INPUTS.reps);
  });

  it('keeps every default inside its range', () => {
    for (const key of Object.keys(ROI_INPUT_RANGES) as Array<
      keyof typeof ROI_INPUT_RANGES
    >) {
      expect(clampRoiInput(key, ROI_DEFAULT_INPUTS[key])).toBe(
        ROI_DEFAULT_INPUTS[key],
      );
    }
  });
});
