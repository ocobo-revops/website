import { describe, expect, it } from 'vitest';

import { countReached, scrollStepProgress } from './use-scroll-steps';

describe('scrollStepProgress', () => {
  it('is -1 while the top sits below 80% of the viewport', () => {
    expect(scrollStepProgress(900, 1000)).toBe(-1);
    expect(scrollStepProgress(801, 1000)).toBe(-1);
  });

  it('runs from 0 to 1 over the next half viewport', () => {
    expect(scrollStepProgress(800, 1000)).toBe(0);
    expect(scrollStepProgress(550, 1000)).toBe(0.5);
    expect(scrollStepProgress(300, 1000)).toBe(1);
  });

  it('caps at 1 once scrolled past', () => {
    expect(scrollStepProgress(-200, 1000)).toBe(1);
  });
});

describe('countReached', () => {
  const thresholds = [0.04, 0.38, 0.7, 0.85];

  it('counts no step before the first threshold', () => {
    expect(countReached(thresholds, -1)).toBe(0);
    expect(countReached(thresholds, 0.03)).toBe(0);
  });

  it('counts a threshold reached exactly', () => {
    expect(countReached(thresholds, 0.38)).toBe(2);
  });

  it('counts every step at the end', () => {
    expect(countReached(thresholds, 1)).toBe(4);
  });
});
