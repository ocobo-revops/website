import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import {
  ROI_DEFAULT_INPUTS,
  ROI_DEFAULT_SCENARIO,
  type RoiInputKey,
  type RoiInputs,
  type RoiScenario,
  clampRoiInput,
  computeRoi,
} from '~/utils/roi';

import { RoiDetail } from './roi-detail';
import { ROI_CALCULATOR_ID } from './roi-ids';
import { RoiInputsCard } from './roi-inputs-card';
import { RoiResultCard } from './roi-result-card';
import { dotBackdropTop } from './roi-styles';
import { RoiWalkthrough } from './roi-walkthrough';

/**
 * The interactive part of the ROI page. One state (five figures and a
 * scenario) feeds the walkthrough, the calculator and the detail table, so
 * the worked example follows the visitor's own numbers.
 */
export function RoiExperience() {
  const { t } = useTranslation('roi');
  const [inputs, setInputs] = useState<RoiInputs>(ROI_DEFAULT_INPUTS);
  const [scenario, setScenario] = useState<RoiScenario>(ROI_DEFAULT_SCENARIO);
  const result = useMemo(
    () => computeRoi(inputs, scenario),
    [inputs, scenario],
  );

  const handleInputChange = (key: RoiInputKey, value: number) => {
    setInputs((current) => ({ ...current, [key]: clampRoiInput(key, value) }));
  };

  return (
    <>
      <RoiWalkthrough result={result} scenario={scenario} />
      <section
        id={ROI_CALCULATOR_ID}
        className={cx(
          section({ bg: 'gray' }),
          dotBackdropTop,
          css({ scrollMarginTop: '20' }),
        )}
      >
        <Container
          className={css({ display: 'flex', flexDir: 'column', gap: '10' })}
        >
          <div
            className={css({
              display: 'flex',
              flexDir: 'column',
              gap: '4',
              maxW: '2xl',
            })}
          >
            <h2 className={text({ variant: 'display-lg' })}>
              {t('calculator.title')}
            </h2>
            <p className={text({ variant: 'body', color: 'muted' })}>
              {t('calculator.intro')}
            </p>
          </div>
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: {
                base: 'minmax(0,1fr)',
                lg: 'minmax(0,1.35fr) minmax(0,1fr)',
              },
              alignItems: 'start',
              gap: '6',
            })}
          >
            <RoiInputsCard
              inputs={inputs}
              scenario={scenario}
              onInputChange={handleInputChange}
              onScenarioChange={setScenario}
            />
            <div
              className={css({
                position: { base: 'static', lg: 'sticky' },
                top: '28',
              })}
            >
              <RoiResultCard result={result} />
            </div>
          </div>
          <RoiDetail result={result} />
        </Container>
      </section>
    </>
  );
}
