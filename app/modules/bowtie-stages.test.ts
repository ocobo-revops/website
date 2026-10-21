import { describe, expect, it } from 'vitest';

import { STAGE_IDS, getStageStates, isStageId } from './bowtie-stages';

describe('STAGE_IDS', () => {
  it('lists the seven Stage ids shared with the posts repo, in bow tie order', () => {
    expect(STAGE_IDS).toEqual([
      'demand-generation',
      'discovery',
      'negotiation',
      'closing',
      'onboarding',
      'adoption',
      'expansion',
    ]);
  });
});

describe('isStageId', () => {
  it.each(STAGE_IDS)('accepts %s', (id) => {
    expect(isStageId(id)).toBe(true);
  });

  it.each(['', 'qualification', 'Discovery', 'impact', 'closing '])(
    'rejects %j',
    (value) => {
      expect(isStageId(value)).toBe(false);
    },
  );
});

describe('getStageStates', () => {
  it('marks only the active stages as active, in bow tie order', () => {
    expect(getStageStates(['negotiation', 'discovery'])).toEqual([
      { id: 'demand-generation', state: 'inactive' },
      { id: 'discovery', state: 'active' },
      { id: 'negotiation', state: 'active' },
      { id: 'closing', state: 'inactive' },
      { id: 'onboarding', state: 'inactive' },
      { id: 'adoption', state: 'inactive' },
      { id: 'expansion', state: 'inactive' },
    ]);
  });

  it('marks every stage inactive when no stage is active', () => {
    expect(getStageStates([]).map(({ state }) => state)).toEqual(
      Array(7).fill('inactive'),
    );
  });

  it('marks every stage active when all seven are active', () => {
    expect(getStageStates(STAGE_IDS).map(({ state }) => state)).toEqual(
      Array(7).fill('active'),
    );
  });

  it('accepts a Set and ignores duplicates', () => {
    expect(getStageStates(new Set(['closing']))).toEqual(
      getStageStates(['closing', 'closing']),
    );
  });
});
