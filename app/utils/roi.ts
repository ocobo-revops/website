/**
 * ROI calculator for the `/roi` page (#248).
 *
 * The sales funnel is a product: reps x opportunities x win rate x deal
 * value x contract duration. A RevOps scenario lifts three of those factors
 * a little, and the gains multiply instead of adding up. Pure functions only:
 * the page wires its sliders to `computeRoi` and formats the result.
 */

export type RoiScenario = 'conservative' | 'ambitious';

export type RoiInputs = {
  /** Number of people who sign deals. */
  reps: number;
  /** Qualified opportunities per rep and per month. */
  oppsPerRepPerMonth: number;
  /** Share of opportunities signed, in percent (25 means 25 %). */
  winRate: number;
  /** Average annual value of a contract, in euros. */
  acv: number;
  /** Average customer lifetime, in years. */
  durationYears: number;
};

export type RoiInputKey = keyof RoiInputs;

export type RoiLevers = {
  /** Relative lift of qualified opportunities (0.05 means +5 %). */
  oppsUplift: number;
  /** Win rate gain, in percentage points. */
  winRatePoints: number;
  /** Relative lift of the average deal value. */
  acvUplift: number;
};

export type RoiFunnel = RoiInputs & {
  oppsPerRepPerYear: number;
  oppsPerYear: number;
  deals: number;
  booking: number;
  contractValue: number;
};

export type RoiResult = {
  today: RoiFunnel;
  withRevops: RoiFunnel;
  /** What each lever adds, in the unit of its input. */
  levers: {
    oppsPerRepPerMonth: number;
    oppsPerRepPerYear: number;
    winRatePoints: number;
    acv: number;
  };
  /** Relative change of each computed row (0.05 means +5 %). */
  deltas: {
    oppsPerYear: number;
    deals: number;
    booking: number;
    contractValue: number;
  };
  /** Absolute gain, in euros. */
  gain: {
    booking: number;
    contractValue: number;
  };
};

export type RoiInputRange = { min: number; max: number; step: number };

const MONTHS_PER_YEAR = 12;
const MAX_WIN_RATE = 100;

export const ROI_SCENARIOS: Readonly<Record<RoiScenario, RoiLevers>> = {
  conservative: { oppsUplift: 0.05, winRatePoints: 1, acvUplift: 0.05 },
  ambitious: { oppsUplift: 0.1, winRatePoints: 3, acvUplift: 0.1 },
};

export const ROI_DEFAULT_SCENARIO: RoiScenario = 'conservative';

export const ROI_DEFAULT_INPUTS: Readonly<RoiInputs> = {
  reps: 4,
  oppsPerRepPerMonth: 10,
  winRate: 25,
  acv: 25_000,
  durationYears: 3,
};

export const ROI_INPUT_RANGES: Readonly<Record<RoiInputKey, RoiInputRange>> = {
  reps: { min: 1, max: 60, step: 1 },
  oppsPerRepPerMonth: { min: 1, max: 40, step: 1 },
  winRate: { min: 5, max: 60, step: 1 },
  acv: { min: 2_000, max: 200_000, step: 1_000 },
  durationYears: { min: 1, max: 5, step: 0.5 },
};

const buildFunnel = (inputs: RoiInputs): RoiFunnel => {
  const oppsPerRepPerYear = inputs.oppsPerRepPerMonth * MONTHS_PER_YEAR;
  const oppsPerYear = inputs.reps * oppsPerRepPerYear;
  const deals = (oppsPerYear * inputs.winRate) / 100;
  const booking = deals * inputs.acv;
  return {
    ...inputs,
    oppsPerRepPerYear,
    oppsPerYear,
    deals,
    booking,
    contractValue: booking * inputs.durationYears,
  };
};

const relativeChange = (before: number, after: number): number =>
  before === 0 ? 0 : after / before - 1;

export const computeRoi = (
  inputs: RoiInputs,
  scenario: RoiScenario,
): RoiResult => {
  const levers = ROI_SCENARIOS[scenario];
  const today = buildFunnel(inputs);
  const withRevops = buildFunnel({
    ...inputs,
    oppsPerRepPerMonth: inputs.oppsPerRepPerMonth * (1 + levers.oppsUplift),
    winRate: Math.min(inputs.winRate + levers.winRatePoints, MAX_WIN_RATE),
    acv: inputs.acv * (1 + levers.acvUplift),
  });

  return {
    today,
    withRevops,
    levers: {
      oppsPerRepPerMonth:
        withRevops.oppsPerRepPerMonth - today.oppsPerRepPerMonth,
      oppsPerRepPerYear: withRevops.oppsPerRepPerYear - today.oppsPerRepPerYear,
      winRatePoints: withRevops.winRate - today.winRate,
      acv: withRevops.acv - today.acv,
    },
    deltas: {
      oppsPerYear: relativeChange(today.oppsPerYear, withRevops.oppsPerYear),
      deals: relativeChange(today.deals, withRevops.deals),
      booking: relativeChange(today.booking, withRevops.booking),
      contractValue: relativeChange(
        today.contractValue,
        withRevops.contractValue,
      ),
    },
    gain: {
      booking: withRevops.booking - today.booking,
      contractValue: withRevops.contractValue - today.contractValue,
    },
  };
};

/** Brings a raw slider value back inside its range, snapped to the step. */
export const clampRoiInput = (key: RoiInputKey, value: number): number => {
  if (!Number.isFinite(value)) return ROI_DEFAULT_INPUTS[key];
  const { min, max, step } = ROI_INPUT_RANGES[key];
  const snapped = min + Math.round((value - min) / step) * step;
  return Math.min(Math.max(snapped, min), max);
};
