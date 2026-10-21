import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';

import { languages, resources } from '~/localization/resources';

import {
  BOWTIE_NAMESPACE,
  MILESTONE_PREFIX_KEY,
  STAGE_IDS,
  STAGE_LABEL_FIELDS,
  getStageLabelKey,
  getStageStates,
  isStageId,
} from './bowtie-stages';

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

describe('stage labels', () => {
  const translators = languages.map((lng) => {
    const i18n = createInstance();
    i18n.init({ lng, resources, initAsync: false });
    return [lng, i18n.getFixedT(lng, BOWTIE_NAMESPACE)] as const;
  });

  it.each(translators)('resolves every stage field in %s', (_lng, t) => {
    for (const id of STAGE_IDS) {
      for (const field of STAGE_LABEL_FIELDS) {
        const key = getStageLabelKey(id, field);
        expect(t(key), key).not.toBe(key);
        expect(t(key).trim(), key).not.toBe('');
      }
    }
  });

  it.each(translators)('resolves the Milestone prefix in %s', (_lng, t) => {
    expect(t(MILESTONE_PREFIX_KEY)).not.toBe(MILESTONE_PREFIX_KEY);
  });

  it('builds keys from the Stage id and the field', () => {
    expect(getStageLabelKey('discovery', 'kpiTitle')).toBe(
      'stages.discovery.kpiTitle',
    );
  });
});
