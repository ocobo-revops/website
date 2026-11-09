import { describe, expect, it } from 'vitest';

import {
  AXIS_END,
  AXIS_START,
  AXIS_Y,
  CURVE_END,
  DOT_COUNT,
  SETTLED_FRAME,
  SETTLE_TIME,
  TEAM_X,
  curveY,
  heroFrame,
} from './home-hero-frame';

describe('curveY', () => {
  it('rises from Marketing to the end of the axis', () => {
    expect(curveY(TEAM_X[0])).toBe(175);
    expect(curveY(AXIS_END)).toBeCloseTo(40);
    expect(curveY(TEAM_X[3])).toBeLessThan(curveY(TEAM_X[2]));
  });

  it('ends where the Ocobo mark sits', () => {
    expect(CURVE_END).toEqual({ x: AXIS_END, y: curveY(AXIS_END) });
  });
});

describe('heroFrame', () => {
  it('starts with nothing on screen', () => {
    const frame = heroFrame(0);

    for (const team of frame.teams) expect(team.opacity).toBe(0);
    expect(frame.axis.opacity).toBe(0);
    expect(frame.curveOffset).toBe(1);
    expect(frame.end.opacity).toBe(0);
    expect(frame.endReached).toBe(false);
    expect(frame.accents).toEqual({ strike: 0, tag: 0, highlight: 0 });
  });

  it('pulses the halo only after the mark has landed', () => {
    expect(heroFrame(SETTLE_TIME).halo.opacity).toBe(0);
    const pulses = [7, 7.5, 8, 9, 10].map((t) => heroFrame(t).halo.opacity);
    expect(Math.max(...pulses)).toBeGreaterThan(0);
  });

  it('puts every team on the axis once the axis is drawn', () => {
    const frame = heroFrame(4);

    expect(frame.axis.x2).toBe(AXIS_END);
    for (const team of frame.teams) {
      expect(team.y).toBeCloseTo(AXIS_Y);
      expect(team.opacity).toBe(1);
    }
  });

  it('settles with the curve drawn and the mark in place', () => {
    const frame = heroFrame(SETTLE_TIME);

    expect(frame.curveOffset).toBe(0);
    expect(frame.clipWidth).toBe(AXIS_END - AXIS_START);
    expect(frame.end).toEqual({ opacity: 1, scale: 1 });
    expect(frame.endReached).toBe(true);
    for (const gain of frame.gains) expect(gain).toEqual({ dy: 0, opacity: 1 });
    expect(frame.accents).toEqual({ strike: 1, tag: 1, highlight: 1 });
  });

  it('keeps the dots flowing along the axis after it settles', () => {
    const later = heroFrame(SETTLE_TIME + 2);
    const moving = later.dots.filter((dot) => dot.opacity > 0);

    expect(later.dots).toHaveLength(DOT_COUNT);
    expect(moving.length).toBeGreaterThan(0);
    for (const dot of moving) expect(dot.y).toBe(AXIS_Y);
  });

  it('never shows a dot beyond the drawn axis', () => {
    for (let t = 0; t < 8; t += 0.1) {
      const frame = heroFrame(t);
      for (const dot of frame.dots) {
        if (dot.tone === 'axis' && dot.opacity > 0) {
          expect(dot.x).toBeLessThanOrEqual(frame.axis.x2);
        }
      }
    }
  });
});

describe('SETTLED_FRAME', () => {
  it('is the settled picture without any moving dot', () => {
    const { dots, ...rest } = SETTLED_FRAME;
    const { dots: _, ...settled } = heroFrame(SETTLE_TIME);

    expect(rest).toEqual(settled);
    expect(dots).toHaveLength(DOT_COUNT);
    for (const dot of dots) expect(dot.opacity).toBe(0);
  });

  it('keeps the still parts by reference once settled', () => {
    const before = heroFrame(SETTLE_TIME + 1);
    const after = heroFrame(SETTLE_TIME + 2);

    expect(after.teams).toBe(before.teams);
    expect(after.accents).toBe(before.accents);
    expect(after.dots).not.toBe(before.dots);
  });
});
