/**
 * Bow tie stage model: the seven stages of the revenue cycle, shared by the
 * method page, the challenge pages and the challenge schema
 * (`bowtie.activeStages`).
 */

/**
 * Frozen list, in bow tie order. The posts repo keeps a copy to validate
 * challenge files: a change needs a PR in both repos (ocobo-revops/posts#94).
 */
export const STAGE_IDS = [
  'demand-generation',
  'discovery',
  'negotiation',
  'closing',
  'onboarding',
  'adoption',
  'expansion',
] as const;

export type StageId = (typeof STAGE_IDS)[number];

export type StageState = 'active' | 'inactive';

export type StageWithState = {
  id: StageId;
  state: StageState;
};

const STAGE_ID_SET: ReadonlySet<string> = new Set(STAGE_IDS);

export function isStageId(value: string): value is StageId {
  return STAGE_ID_SET.has(value);
}

/**
 * Turns a set of active stages into the state of every stage, in bow tie
 * order.
 */
export function getStageStates(
  activeStages: Iterable<StageId>,
): StageWithState[] {
  const active = new Set(activeStages);
  return STAGE_IDS.map((id) => ({
    id,
    state: active.has(id) ? 'active' : 'inactive',
  }));
}

/** Labels live in the `bowtie` locale namespace, French and English. */
export const BOWTIE_NAMESPACE = 'bowtie';

export const STAGE_LABEL_FIELDS = [
  'label',
  'milestone',
  'kpiTitle',
  'kpiShort',
  'description',
] as const;

export type StageLabelField = (typeof STAGE_LABEL_FIELDS)[number];

/** Shared prefix shown before a stage's Milestone ("Jalon" in French). */
export const MILESTONE_PREFIX_KEY = 'milestonePrefix';

export function getStageLabelKey(id: StageId, field: StageLabelField): string {
  return `stages.${id}.${field}`;
}
