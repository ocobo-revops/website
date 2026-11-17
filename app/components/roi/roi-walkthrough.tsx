import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import type { RoiResult, RoiScenario } from '~/utils/roi';

import { ROI_CALCULATOR_ID, ROI_WALKTHROUGH_ID } from './roi-ids';
import { dotBackdrop } from './roi-styles';
import {
  Band,
  type Term,
  buildCells,
  grid,
  leverChip,
} from './roi-walkthrough-band';
import { useRoiFormat } from './use-roi-format';

/**
 * "Le calcul, pas à pas" (mockup `roi`): the funnel formula written out as a
 * staircase, once with today's figures and once with the RevOps scenario.
 * It reads the same state as the calculator below, so it follows the
 * visitor's numbers. Too wide for a phone: it scrolls sideways there.
 */

type RoiWalkthroughProps = {
  result: RoiResult;
  scenario: RoiScenario;
};

export function RoiWalkthrough({ result, scenario }: RoiWalkthroughProps) {
  const { t } = useTranslation('roi');
  const f = useRoiFormat();
  const { today, withRevops, levers } = result;
  const label = (term: Term) => t(`walkthrough.terms.${term}`);

  const leverChips = [
    { column: 3, content: f.oppsPerYear(levers.oppsPerRepPerYear) },
    { column: 5, content: f.signedPoints(levers.winRatePoints) },
    { column: 9, content: f.signedEuro(levers.acv) },
  ];

  return (
    <section
      id={ROI_WALKTHROUGH_ID}
      className={cx(
        section({ bg: 'white' }),
        dotBackdrop,
        css({ pt: '6', scrollMarginTop: '20' }),
      )}
    >
      <Container
        className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4',
            maxW: '3xl',
            mx: 'auto',
            mb: '3',
            textAlign: 'center',
          })}
        >
          <span className={text({ variant: 'label', color: 'muted' })}>
            {t('walkthrough.eyebrow')}
          </span>
          <h2 className={text({ variant: 'display-lg' })}>
            {t('walkthrough.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('walkthrough.intro')}
          </p>
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'column', md: 'row' },
            alignItems: { md: 'baseline' },
            gap: { base: '1.5', md: '4' },
            bg: 'white',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'line',
            borderLeftWidth: '3px',
            borderLeftColor: 'yellow',
            borderRadius: '2xl',
            px: '6',
            py: '4',
            mb: '2',
          })}
        >
          <span
            className={cx(
              text({ variant: 'label', color: 'muted' }),
              css({ flex: 'none' }),
            )}
          >
            {t('walkthrough.example.label')}
          </span>
          <p className={text({ variant: 'small', color: 'muted' })}>
            {t('walkthrough.example.text', {
              reps: f.count(today.reps),
              opps: f.decimal(today.oppsPerRepPerMonth),
              winRate: f.percent(today.winRate),
              acv: f.euro(today.acv),
              oppsLever: f.decimal(levers.oppsPerRepPerMonth),
              count: levers.oppsPerRepPerMonth,
              winRateLever: f.points(levers.winRatePoints),
              acvLever: f.euro(levers.acv),
            })}
          </p>
        </div>

        <p
          className={cx(
            text({ variant: 'small', color: 'muted' }),
            css({ display: { base: 'block', lg: 'none' } }),
          )}
        >
          {t('walkthrough.scrollHint')}
        </p>
        <section
          aria-label={t('walkthrough.scrollLabel')}
          // Keyboard users scroll the wide formula with the arrow keys.
          tabIndex={0}
          className={css({
            overflowX: 'auto',
            mx: '-2',
            px: '2',
            pt: '4',
            pb: '2',
            _focusVisible: {
              outlineWidth: '2px',
              outlineStyle: 'solid',
              outlineColor: 'yellow',
              borderRadius: '2xl',
            },
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              minW: '[1000px]',
            })}
          >
            <Band
              title={t('walkthrough.formula')}
              cells={buildCells('formula', label, today, f)}
            />
            <Band
              title={t('walkthrough.today')}
              cells={buildCells('today', label, today, f)}
            />
            <div className={cx(grid, css({ px: '7' }))}>
              {leverChips.map((chip) => (
                <span
                  key={chip.column}
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1',
                    justifySelf: 'center',
                  })}
                  style={{ gridColumn: chip.column, gridRow: 1 }}
                >
                  <ArrowDown
                    size={14}
                    aria-hidden="true"
                    className={css({ color: 'gray.400' })}
                  />
                  <span className={leverChip}>{chip.content}</span>
                </span>
              ))}
            </div>
            <Band
              title={t('walkthrough.withRevops', {
                scenario: t(`walkthrough.scenario.${scenario}`),
              })}
              cells={buildCells('revops', label, withRevops, f)}
              revops
              gain={t('walkthrough.gain', {
                amount: f.signedEuro(result.gain.contractValue),
              })}
            />
          </div>
        </section>
        <a
          href={`#${ROI_CALCULATOR_ID}`}
          className={css({
            alignSelf: 'center',
            mt: '4',
            fontWeight: 'bold',
            textDecoration: 'underline',
            textUnderlineOffset: '[4px]',
          })}
        >
          {t('walkthrough.edit')}
        </a>
      </Container>
    </section>
  );
}
