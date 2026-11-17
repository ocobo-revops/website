import { describe, expect, it } from 'vitest';
import {
  formatRoiCount,
  formatRoiDecimal,
  formatRoiEuro,
  formatRoiPercent,
  formatRoiPercentDelta,
} from './roi-format';

const NBSP = ' ';

describe('formatRoiEuro', () => {
  it('writes millions with two decimals in French', () => {
    expect(formatRoiEuro(9_000_000, 'fr')).toBe(`9,00${NBSP}M€`);
    expect(formatRoiEuro(3_439_800, 'fr')).toBe(`3,44${NBSP}M€`);
  });

  it('drops to one decimal from ten million, none from a hundred million', () => {
    expect(formatRoiEuro(10_319_400, 'fr')).toBe(`10,3${NBSP}M€`);
    expect(formatRoiEuro(123_456_789, 'fr')).toBe(`123${NBSP}M€`);
  });

  it('writes thousands with one decimal, without a trailing zero', () => {
    expect(formatRoiEuro(26_250, 'fr')).toBe(`26,3${NBSP}k€`);
    expect(formatRoiEuro(25_000, 'fr')).toBe(`25${NBSP}k€`);
    expect(formatRoiEuro(1_250, 'fr')).toBe(`1,3${NBSP}k€`);
    expect(formatRoiEuro(439_800, 'fr')).toBe(`440${NBSP}k€`);
  });

  it('rounds amounts under a thousand', () => {
    expect(formatRoiEuro(812.4, 'fr')).toBe(`812${NBSP}€`);
  });

  it('puts the symbol first in English', () => {
    expect(formatRoiEuro(9_000_000, 'en')).toBe('€9.00M');
    expect(formatRoiEuro(26_250, 'en')).toBe('€26.3k');
    expect(formatRoiEuro(25_000, 'en')).toBe('€25k');
    expect(formatRoiEuro(812.4, 'en')).toBe('€812');
  });

  it('keeps the sign of a negative amount', () => {
    expect(formatRoiEuro(-1_250, 'en')).toBe('-€1.3k');
  });

  it('moves to the next unit when rounding reaches a thousand', () => {
    expect(formatRoiEuro(999.6, 'fr')).toBe(`1${NBSP}k€`);
    expect(formatRoiEuro(999_600, 'fr')).toBe(`1,00${NBSP}M€`);
  });

  it('takes the decimals of the rounded figure', () => {
    expect(formatRoiEuro(9_999_000, 'fr')).toBe(`10,0${NBSP}M€`);
    expect(formatRoiEuro(99_960_000, 'en')).toBe('€100M');
    expect(formatRoiEuro(99_960, 'en')).toBe('€100k');
  });
});

describe('formatRoiDecimal', () => {
  it('shows a decimal only when the value has one', () => {
    expect(formatRoiDecimal(3, 'fr')).toBe('3');
    expect(formatRoiDecimal(1.5, 'fr')).toBe('1,5');
    expect(formatRoiDecimal(10.5, 'en')).toBe('10.5');
  });

  it('rounds to one decimal', () => {
    expect(formatRoiDecimal(0.55, 'en')).toBe('0.6');
    expect(formatRoiDecimal(5.999, 'en')).toBe('6');
  });
});

describe('formatRoiCount', () => {
  it('rounds to a whole number', () => {
    expect(formatRoiCount(131.04, 'fr')).toBe('131');
  });

  it('groups thousands', () => {
    expect(formatRoiCount(1_234, 'en')).toBe('1,234');
    expect(formatRoiCount(1_234, 'fr')).toBe(`1${NBSP}234`);
  });
});

describe('formatRoiPercentDelta', () => {
  it('signs a relative change and rounds it', () => {
    expect(formatRoiPercentDelta(0.05, 'fr')).toBe(`+5${NBSP}%`);
    expect(formatRoiPercentDelta(0.1466, 'en')).toBe('+15%');
    expect(formatRoiPercentDelta(-0.02, 'en')).toBe('-2%');
    expect(formatRoiPercentDelta(0, 'en')).toBe('+0%');
  });
});

describe('formatRoiPercent', () => {
  it('writes a win rate', () => {
    expect(formatRoiPercent(25, 'fr')).toBe(`25${NBSP}%`);
    expect(formatRoiPercent(26, 'en')).toBe('26%');
  });
});
