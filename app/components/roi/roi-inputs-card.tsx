import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card } from '@ocobo/styled-system/recipes';

import {
  ROI_INPUT_RANGES,
  ROI_SCENARIOS,
  type RoiInputKey,
  type RoiInputs,
  type RoiScenario,
} from '~/utils/roi';

import { RoiRangeInput } from './roi-range-input';
import { RoiStep } from './roi-step';
import { type RoiFormat, useRoiFormat } from './use-roi-format';

/**
 * Steps 1 and 2 of the ROI calculator (mockup `roi`): the visitor's five
 * figures, then the RevOps scenario and the levers it applies.
 */

const INPUT_KEYS: ReadonlyArray<RoiInputKey> = [
  'reps',
  'oppsPerRepPerMonth',
  'winRate',
  'acv',
  'durationYears',
];

const SCENARIOS: ReadonlyArray<RoiScenario> = ['conservative', 'ambitious'];

const formatInput = (key: RoiInputKey, value: number, f: RoiFormat) => {
  switch (key) {
    case 'reps':
      return f.count(value);
    case 'oppsPerRepPerMonth':
      return f.decimal(value);
    case 'winRate':
      return f.percent(value);
    case 'acv':
      return f.euro(value);
    case 'durationYears':
      return f.years(value);
  }
};

// A hairline between figures, except above the first row of the grid.
const inputSeparators = {
  none: css({}),
  wide: css({
    borderTopWidth: { base: '1px', md: '0' },
    borderTopStyle: 'solid',
    borderTopColor: 'gray.100',
  }),
  all: css({
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'gray.100',
  }),
};
const separatorFor = (index: number) =>
  index === 0
    ? inputSeparators.none
    : index === 1
      ? inputSeparators.wide
      : inputSeparators.all;
// The last figure takes the whole row when the count is odd.
const lastOdd = css({ gridColumn: { md: '1 / -1' } });

const toggleButton = css({
  minH: '11',
  rounded: 'full',
  fontSize: 'md',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'colors',
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'yellow',
    outlineOffset: '0.5',
  },
});
const toggleStates = {
  active: css({ bg: 'dark', color: 'white' }),
  idle: css({ bg: 'transparent', color: 'gray', _hover: { color: 'dark' } }),
};

const leverPill = css({
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '1',
  fontSize: 'caption',
  color: 'gray.600',
  bg: 'white',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'line',
  rounded: 'full',
  px: '3',
  py: '1.5',
});

type RoiInputsCardProps = {
  inputs: RoiInputs;
  scenario: RoiScenario;
  onInputChange: (key: RoiInputKey, value: number) => void;
  onScenarioChange: (scenario: RoiScenario) => void;
};

export function RoiInputsCard({
  inputs,
  scenario,
  onInputChange,
  onScenarioChange,
}: RoiInputsCardProps) {
  const { t } = useTranslation('roi');
  const f = useRoiFormat();
  const levers = ROI_SCENARIOS[scenario];
  const leverPills = [
    { key: 'opps', value: f.delta(levers.oppsUplift) },
    { key: 'winRate', value: f.signedPoints(levers.winRatePoints) },
    { key: 'acv', value: f.delta(levers.acvUplift) },
  ];

  return (
    <div
      className={cx(
        card({ shadow: 'card' }),
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: '6',
          p: { base: '5', md: '7' },
        }),
      )}
    >
      <RoiStep
        number={1}
        title={t('calculator.step1.title')}
        hint={t('calculator.step1.hint')}
      />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: '7',
          rowGap: '1.5',
        })}
      >
        {INPUT_KEYS.map((key, index) => (
          <div
            key={key}
            className={cx(
              separatorFor(index),
              index === INPUT_KEYS.length - 1 &&
                INPUT_KEYS.length % 2 === 1 &&
                lastOdd,
            )}
          >
            <RoiRangeInput
              label={t(`calculator.inputs.${key}.label`)}
              hint={t(`calculator.inputs.${key}.hint`)}
              value={inputs[key]}
              formatted={formatInput(key, inputs[key], f)}
              range={ROI_INPUT_RANGES[key]}
              onChange={(value) => onInputChange(key, value)}
            />
          </div>
        ))}
      </div>

      <hr className={css({ borderColor: 'line' })} />

      <RoiStep
        number={2}
        title={t('calculator.step2.title')}
        hint={t(`calculator.step2.hint.${scenario}`)}
      />
      <fieldset
        className={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1',
          bg: 'gray.light',
          rounded: 'full',
          p: '1',
          maxW: 'sm',
          border: 'none',
        })}
      >
        <legend className={css({ srOnly: true })}>
          {t('calculator.scenario.label')}
        </legend>
        {SCENARIOS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={scenario === option}
            onClick={() => onScenarioChange(option)}
            className={cx(
              toggleButton,
              scenario === option ? toggleStates.active : toggleStates.idle,
            )}
          >
            {t(`calculator.scenario.${option}`)}
          </button>
        ))}
      </fieldset>
      <ul className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {leverPills.map((pill) => (
          <li key={pill.key} className={leverPill}>
            <strong className={css({ color: 'mint.dark' })}>
              {pill.value}
            </strong>
            {t(`calculator.levers.${pill.key}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}
