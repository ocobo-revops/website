import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import type { RoiResult } from '~/utils/roi';

import { ROI_DETAIL_ID } from './roi-ids';
import { stepHint, stepTitle } from './roi-step';
import { type RoiFormat, useRoiFormat } from './use-roi-format';

/**
 * "Le détail, ligne par ligne" (mockup `roi`): every step of the funnel,
 * today, the RevOps lever and the result. Input rows carry a lever; grey
 * result rows carry the relative change. ARIA table roles keep it a table
 * for screen readers while the grid reflows on a phone.
 */

type RowKind = 'input' | 'result' | 'final';

type Row = {
  key: string;
  operator: string;
  kind: RowKind;
  today: string;
  withRevops: string;
  /** The lever (input rows) or the relative change (result rows). */
  change?: string;
};

const buildRows = (result: RoiResult, f: RoiFormat): Row[] => {
  const { today: a, withRevops: b, levers, deltas } = result;
  return [
    {
      key: 'reps',
      operator: '',
      kind: 'input',
      today: f.count(a.reps),
      withRevops: f.count(b.reps),
    },
    {
      key: 'oppsPerRepPerMonth',
      operator: '×',
      kind: 'input',
      today: f.decimal(a.oppsPerRepPerMonth),
      withRevops: f.decimal(b.oppsPerRepPerMonth),
      change: f.oppsPerMonth(levers.oppsPerRepPerMonth),
    },
    {
      key: 'oppsPerYear',
      operator: '=',
      kind: 'result',
      today: f.count(a.oppsPerYear),
      withRevops: f.count(b.oppsPerYear),
      change: f.delta(deltas.oppsPerYear),
    },
    {
      key: 'winRate',
      operator: '×',
      kind: 'input',
      today: f.percent(a.winRate),
      withRevops: f.percent(b.winRate),
      change: f.signedPoints(levers.winRatePoints),
    },
    {
      key: 'deals',
      operator: '=',
      kind: 'result',
      today: f.count(a.deals),
      withRevops: f.count(b.deals),
      change: f.delta(deltas.deals),
    },
    {
      key: 'acv',
      operator: '×',
      kind: 'input',
      today: f.euro(a.acv),
      withRevops: f.euro(b.acv),
      change: f.signedEuro(levers.acv),
    },
    {
      key: 'booking',
      operator: '=',
      kind: 'result',
      today: f.euro(a.booking),
      withRevops: f.euro(b.booking),
      change: f.delta(deltas.booking),
    },
    {
      key: 'durationYears',
      operator: '×',
      kind: 'input',
      today: f.years(a.durationYears),
      withRevops: f.years(b.durationYears),
    },
    {
      key: 'contractValue',
      operator: '=',
      kind: 'final',
      today: f.euro(a.contractValue),
      withRevops: f.euro(b.contractValue),
      change: f.delta(deltas.contractValue),
    },
  ];
};

const rowGrid = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '28px minmax(0,1.2fr) auto minmax(0,1fr)',
    md: '36px minmax(0,1.5fr) minmax(0,1.3fr) 120px minmax(0,1fr)',
  },
  alignItems: 'center',
  columnGap: '4',
  rowGap: '1',
  px: '4',
});
// `cx` does not merge classes: the header and the rows each set their own
// vertical padding, never both on one element.
const rowPad = css({ py: '3.5' });
const rowKinds: Record<RowKind, string> = {
  input: css({
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'gray.100',
  }),
  result: css({ bg: 'gray.light', rounded: '2xl', my: '1' }),
  final: css({ bg: 'dark', color: 'white', rounded: '2xl', my: '1' }),
};
// On a phone the label takes the top line and the figures sit below it.
const operatorCell = cx(
  text({ variant: 'display-md-black' }),
  css({
    gridRow: { base: 'span 2', md: 'auto' },
    fontSize: 'xl',
    // gray.400 was too pale to read (Ocobo review).
    color: 'gray',
    textAlign: 'center',
  }),
);
const labelCell = css({
  gridColumn: { base: '2 / -1', md: 'auto' },
  fontWeight: 'semibold',
});
const todayCell = css({ fontVariantNumeric: 'tabular-nums' });
const changeCell = css({ justifySelf: 'center' });
const revopsCell = cx(
  text({ variant: 'display-md-black' }),
  css({
    justifySelf: 'end',
    fontSize: 'xl',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  }),
);
// `text()` sets the dark colour, invisible on the dark final row.
const finalRevopsCell = css({ color: 'white' });
const pill = css({
  display: 'inline-block',
  minW: '16',
  textAlign: 'center',
  fontSize: 'caption',
  fontWeight: 'bold',
  rounded: 'full',
  px: '2.5',
  py: '1',
  whiteSpace: 'nowrap',
});
const pillKinds: Record<RowKind, string> = {
  input: css({
    bg: 'yellow.light',
    color: 'dark',
    boxShadow: '[inset 0 0 0 1px var(--colors-yellow)]',
  }),
  result: css({ bg: 'mint.light', color: 'mint.dark' }),
  final: css({ bg: 'mint.light', color: 'mint.dark' }),
};
const headCell = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  // The label tracking does not fit the narrow phone columns.
  letterSpacing: { base: 'chip', md: 'label' },
  lineHeight: 'tight',
  // gray.400 is 2.6:1 on white, below WCAG AA for small text.
  color: 'gray',
});

type RoiDetailProps = {
  result: RoiResult;
};

export function RoiDetail({ result }: RoiDetailProps) {
  const { t } = useTranslation('roi');
  const f = useRoiFormat();
  const rows = buildRows(result, f);

  return (
    <div
      id={ROI_DETAIL_ID}
      className={cx(
        card({ shadow: 'card' }),
        css({
          display: 'flex',
          flexDir: 'column',
          gap: '4',
          px: { base: '3', md: '4' },
          pt: '6',
          pb: '4',
          scrollMarginTop: '24',
        }),
      )}
    >
      <div className={css({ px: '4' })}>
        <h3 className={stepTitle}>{t('detail.title')}</h3>
        <p className={cx(stepHint, css({ color: 'gray' }))}>
          {t('detail.hint')}
        </p>
      </div>
      <div className={css({ overflowX: 'auto' })}>
        <div
          role="table"
          aria-label={t('detail.title')}
          className={css({ minW: { base: '0', md: '[680px]' } })}
        >
          <div role="row" className={cx(rowGrid, css({ py: '2' }))}>
            {/* The operator column is hidden in every row, so here too. */}
            <span role="columnheader" aria-hidden="true" />
            {/* On a phone the labels sit on their own line: this empty
                header leaves the grid there, so the figure headers line up
                with the figures, and stays a header for screen readers. */}
            <span
              role="columnheader"
              className={css({
                position: { base: 'absolute', md: 'static' },
              })}
            />
            <span
              role="columnheader"
              className={cx(
                headCell,
                css({ gridColumn: { base: '2 / 4', md: 'auto' } }),
              )}
            >
              {t('detail.head.today')}
            </span>
            {/* Too wide for a phone, where the pills speak for themselves:
                hidden there but still read as the column header. */}
            <span
              role="columnheader"
              className={cx(
                headCell,
                css({
                  textAlign: 'center',
                  position: { base: 'absolute', md: 'static' },
                  opacity: { base: 0, md: 1 },
                }),
              )}
            >
              {t('detail.head.lever')}
            </span>
            <span
              role="columnheader"
              className={cx(
                headCell,
                css({
                  gridColumn: { base: '4', md: 'auto' },
                  justifySelf: 'end',
                  whiteSpace: 'nowrap',
                }),
              )}
            >
              {t('detail.head.withRevops')}
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.key}
              role="row"
              className={cx(rowGrid, rowPad, rowKinds[row.kind])}
            >
              <span role="cell" aria-hidden="true" className={operatorCell}>
                {row.operator}
              </span>
              <span role="rowheader" className={labelCell}>
                {t(`detail.rows.${row.key}`)}
              </span>
              <span role="cell" className={todayCell}>
                {row.today}
              </span>
              <span role="cell" className={changeCell}>
                {row.change ? (
                  <span className={cx(pill, pillKinds[row.kind])}>
                    {row.change}
                  </span>
                ) : (
                  <span className={css({ color: 'gray' })}>
                    <span aria-hidden="true">·</span>
                    <span className={css({ srOnly: true })}>
                      {t('detail.noLever')}
                    </span>
                  </span>
                )}
              </span>
              <span
                role="cell"
                className={cx(
                  revopsCell,
                  row.kind === 'final' && finalRevopsCell,
                )}
              >
                {row.withRevops}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
