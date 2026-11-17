import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import type { RoiFunnel } from '~/utils/roi';

import type { RoiFormat } from './use-roi-format';

/**
 * One band of the ROI walkthrough: the funnel formula on a 15-column grid,
 * with labels (the formula), today's figures or the RevOps figures.
 */

type CellKind = 'label' | 'op' | 'value' | 'ring' | 'result' | 'final';

type Cell = {
  key: string;
  column: number;
  row: number;
  kind: CellKind;
  content: string;
};

export type Term =
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

export type BandKind = 'formula' | 'today' | 'revops';

export const buildCells = (
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
  // Grid placement only moves cells visually: sort them so a screen reader
  // reads the formula in order.
  return [...terms, ...operators].sort(
    (a, b) => a.row - b.row || a.column - b.column,
  );
};

// 8 terms and 7 operators side by side (mockup `pg-grid`).
export const grid = css({
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
  final: cx(
    text({ variant: 'display-md-black' }),
    css({
      fontSize: 'lg',
      color: 'white',
      bg: 'dark',
      rounded: 'full',
      px: '4',
      py: '2',
    }),
  ),
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
const gainPill = cx(
  text({ variant: 'display-md-black' }),
  css({
    justifySelf: 'center',
    alignSelf: 'center',
    whiteSpace: 'nowrap',
    fontSize: 'xl',
    color: 'mint.dark',
    bg: 'mint.light',
    boxShadow: '[inset 0 0 0 1px var(--colors-mint)]',
    rounded: 'full',
    px: '4',
    py: '1.5',
  }),
);
export const leverChip = css({
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

export function Band({ title, cells, revops, gain }: BandProps) {
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
