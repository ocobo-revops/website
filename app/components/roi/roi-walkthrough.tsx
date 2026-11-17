import { ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import type { RoiFunnel, RoiResult, RoiScenario } from '~/utils/roi';

import { ROI_CALCULATOR_ID, ROI_WALKTHROUGH_ID } from './roi-ids';
import { dotBackdrop } from './roi-styles';
import { type RoiFormat, useRoiFormat } from './use-roi-format';

/**
 * "Le calcul, pas à pas" (mockup `roi`): the funnel formula written out as a
 * staircase, once with today's figures and once with the RevOps scenario.
 * It reads the same state as the calculator below, so it follows the
 * visitor's numbers. Too wide for a phone: it scrolls sideways there.
 */

type CellKind = 'label' | 'op' | 'value' | 'ring' | 'result' | 'final';

type Cell = {
  key: string;
  column: number;
  row: number;
  kind: CellKind;
  content: string;
};

type Term =
  | 'reps'
  | 'opps'
  | 'winRate'
  | 'deals'
  | 'acv'
  | 'booking'
  | 'duration'
  | 'contractValue';

// Where each term sits: three steps down, one per result.
const TERMS: ReadonlyArray<{
  term: Term;
  column: number;
  row: number;
  result?: boolean;
  lever?: boolean;
}> = [
  { term: 'reps', column: 1, row: 1 },
  { term: 'opps', column: 3, row: 1, lever: true },
  { term: 'winRate', column: 5, row: 1, lever: true },
  { term: 'deals', column: 7, row: 1, result: true },
  { term: 'acv', column: 9, row: 2, lever: true },
  { term: 'booking', column: 11, row: 2, result: true },
  { term: 'duration', column: 13, row: 3 },
  { term: 'contractValue', column: 15, row: 3, result: true },
];

const OPERATORS: ReadonlyArray<{ column: number; row: number; sign: string }> =
  [
    { column: 2, row: 1, sign: '×' },
    { column: 4, row: 1, sign: '×' },
    { column: 6, row: 1, sign: '=' },
    { column: 8, row: 2, sign: '×' },
    { column: 10, row: 2, sign: '=' },
    { column: 12, row: 3, sign: '×' },
    { column: 14, row: 3, sign: '=' },
  ];

const termValue = (term: Term, funnel: RoiFunnel, f: RoiFormat): string => {
  switch (term) {
    case 'reps':
      return f.count(funnel.reps);
    case 'opps':
      return f.decimal(funnel.oppsPerRepPerYear);
    case 'winRate':
      return f.percent(funnel.winRate);
    case 'deals':
      return f.count(funnel.deals);
    case 'acv':
      return f.euro(funnel.acv);
    case 'booking':
      return f.euro(funnel.booking);
    case 'duration':
      return f.years(funnel.durationYears);
    case 'contractValue':
      return f.euro(funnel.contractValue);
  }
};

type BandKind = 'formula' | 'today' | 'revops';

const buildCells = (
  band: BandKind,
  label: (term: Term) => string,
  funnel: RoiFunnel,
  f: RoiFormat,
): Cell[] => {
  const terms = TERMS.map(({ term, column, row, result, lever }): Cell => {
    const base = { key: term, column, row };
    if (band === 'formula') {
      return { ...base, kind: 'label', content: label(term) };
    }
    const content = termValue(term, funnel, f);
    if (band === 'today') {
      return { ...base, kind: lever ? 'ring' : 'value', content };
    }
    if (term === 'contractValue') return { ...base, kind: 'final', content };
    return { ...base, kind: result ? 'result' : 'value', content };
  });
  const operators = OPERATORS.map(
    ({ column, row, sign }): Cell => ({
      key: `op-${column}`,
      column,
      row,
      kind: 'op',
      content: sign,
    }),
  );
  return [...terms, ...operators];
};

// 8 terms and 7 operators side by side (mockup `pg-grid`).
const grid = css({
  display: 'grid',
  gridTemplateColumns:
    'minmax(0,1fr) 24px minmax(0,1.1fr) 24px minmax(0,1fr) 24px minmax(0,1fr) 24px minmax(0,1fr) 24px minmax(0,1.1fr) 24px minmax(0,.8fr) 24px minmax(0,1.2fr)',
  rowGap: '0.5',
  fontVariantNumeric: 'tabular-nums',
});

const cellBase = css({
  justifySelf: 'center',
  alignSelf: 'center',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  px: '1',
  py: '2',
});
const cellStyles: Record<CellKind, string> = {
  label: cx(text({ variant: 'label', color: 'muted' }), css({ px: '1' })),
  op: css({ fontSize: 'md', color: 'gray.300' }),
  value: css({ fontSize: 'md', fontWeight: 'semibold', color: 'dark' }),
  ring: css({
    fontSize: 'md',
    fontWeight: 'semibold',
    color: 'dark',
    bg: 'mint.light',
    boxShadow: '[inset 0 0 0 1px var(--colors-mint)]',
    rounded: 'full',
    px: '3',
    py: '1.5',
  }),
  result: css({ fontSize: 'md', fontWeight: 'extrabold', color: 'dark' }),
  final: css({
    fontFamily: 'display',
    fontWeight: 'black',
    fontSize: 'lg',
    color: 'white',
    bg: 'dark',
    rounded: 'full',
    px: '4',
    py: '2',
  }),
};

const band = cx(
  card({ padding: 'sm', radius: 'lg' }),
  css({ position: 'relative', pt: '12', px: '6' }),
);
const bandRevops = css({
  borderColor: 'mint',
  boxShadow: 'hover',
});
const tag = cx(
  text({ variant: 'label', color: 'muted' }),
  css({
    position: 'absolute',
    top: '5',
    left: '6',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    _before: {
      content: '""',
      w: '1.5',
      h: '1.5',
      rounded: 'full',
      bg: 'gray.300',
    },
  }),
);
const tagRevops = css({
  color: 'dark',
  _before: { bg: 'mint', boxShadow: '[0 0 0 3px var(--colors-mint-light)]' },
});
const gainPill = css({
  justifySelf: 'center',
  alignSelf: 'center',
  whiteSpace: 'nowrap',
  fontFamily: 'display',
  fontWeight: 'black',
  fontSize: 'xl',
  color: 'mint.dark',
  bg: 'mint.light',
  boxShadow: '[inset 0 0 0 1px var(--colors-mint)]',
  rounded: 'full',
  px: '4',
  py: '1.5',
});
const leverChip = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  color: 'mint.dark',
  bg: 'white',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'mint',
  rounded: 'full',
  px: '2.5',
  py: '0.5',
  whiteSpace: 'nowrap',
});

type BandProps = {
  title: string;
  cells: Cell[];
  revops?: boolean;
  gain?: string;
};

function Band({ title, cells, revops, gain }: BandProps) {
  return (
    <div className={cx(band, revops && bandRevops)}>
      <span className={cx(tag, revops && tagRevops)}>{title}</span>
      <div className={grid}>
        {cells.map((cell) => (
          <span
            key={cell.key}
            className={cx(cellBase, cellStyles[cell.kind])}
            // Grid placement is data: one cell per term of the formula.
            style={{ gridColumn: cell.column, gridRow: cell.row }}
          >
            {cell.content}
          </span>
        ))}
        {gain ? (
          <span
            className={gainPill}
            style={{ gridColumn: '13 / span 3', gridRow: 1 }}
          >
            {gain}
          </span>
        ) : null}
      </div>
    </div>
  );
}

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
