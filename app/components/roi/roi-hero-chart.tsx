import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

/**
 * The hero curve of the ROI page (mockup `roi`): revenue grows in a straight
 * line without RevOps, and bends upward as each lever adds to the others.
 * Decorative: the copy above says the same thing in words. It draws itself
 * on load with the shared `il-*` keyframes, and stays still under reduced
 * motion.
 */

const easeOut = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const easeBack = 'cubic-bezier(0.2, 0.8, 0.2, 1.4)';

const root = css({
  position: 'relative',
  maxW: '6xl',
  mx: 'auto',
  mt: '14',
  '& svg': { display: 'block', overflow: 'visible', w: 'full', h: 'auto' },
  '& .hx-exp': {
    strokeDasharray: '1',
    animation: '[il-draw 1.8s cubic-bezier(0.6, 0, 0.2, 1) 0.2s backwards]',
  },
  '& .hx-lin': { animation: '[il-fade 0.8s ease 0.2s backwards]' },
  '& .hx-area': { animation: '[il-fade 1s ease 1.4s backwards]' },
  '& .hx-lt': { animation: '[il-fade 0.6s ease 0.9s backwards]' },
  '& .hx-dot': {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    animation: `[il-pop 0.4s ${easeBack} backwards]`,
  },
  '& .hx-d1': { animationDelay: '[0.9s]' },
  '& .hx-d2': { animationDelay: '[1.25s]' },
  '& .hx-d3': { animationDelay: '[1.55s]' },
  '& .hx-d4': { animationDelay: '[1.95s]' },
  '& .hx-chip': { animation: `[il-fade 0.5s ${easeOut} backwards]` },
  '& .hx-c1': { animationDelay: '[1s]' },
  '& .hx-c2': { animationDelay: '[1.35s]' },
  '& .hx-c3': { animationDelay: '[1.65s]' },
  '& .hx-end': { animationDelay: '[2.05s]' },
  _motionReduce: {
    '& .hx-exp, & .hx-lin, & .hx-area, & .hx-lt, & .hx-dot, & .hx-chip': {
      animation: '[none]',
    },
  },
});

const axis = css({ stroke: 'gray.200', strokeWidth: '2' });
const gridLine = css({
  stroke: 'gray.100',
  strokeWidth: '1',
  strokeDasharray: '4 6',
});
const area = css({ fill: 'yellow.light' });
const linear = css({
  fill: '[none]',
  stroke: 'gray.400',
  strokeWidth: '3',
  strokeLinecap: 'round',
});
const curve = css({
  fill: '[none]',
  stroke: 'dark',
  strokeWidth: '5',
  strokeLinecap: 'round',
});
const dotBase = css({ stroke: 'white', strokeWidth: '4' });
const dotFills = {
  mint: css({ fill: 'mint' }),
  sky: css({ fill: 'sky' }),
  coral: css({ fill: 'coral' }),
};
const dotEnd = css({ fill: 'yellow', stroke: 'dark', strokeWidth: '4' });
const axisLabel = css({
  fill: 'gray.400',
  fontSize: 'sm',
  fontStyle: 'italic',
});
const linearLabel = css({
  fill: 'gray',
  fontSize: 'sm',
  fontWeight: 'semibold',
});

const chip = css({
  position: 'absolute',
  // Centred above its point on the curve.
  transform: 'translate(-50%, calc(-100% - 18px))',
  whiteSpace: 'nowrap',
  bg: 'white',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'gray.200',
  boxShadow: 'rest',
  rounded: 'full',
  px: { base: '2', md: '3.5' },
  py: { base: '1', md: '1.5' },
  fontSize: { base: 'xs', md: 'sm' },
  fontWeight: 'bold',
  color: 'dark',
});
// Two chips would overlap the others on a phone.
const chipWide = css({ display: { base: 'none', md: 'block' } });
const chipEnd = css({
  bg: 'dark',
  borderColor: 'dark',
  color: 'yellow',
  fontSize: { base: 'sm', md: 'lg' },
  px: { base: '3', md: '5' },
  py: { base: '1.5', md: '2.5' },
  transform: {
    base: 'translate(-100%, calc(-100% - 14px))',
    md: 'translate(-80%, calc(-100% - 22px))',
  },
});
// The points of the curve, as a share of the 1000 x 320 view box.
const chipPositions = {
  c1: css({ left: '[45.6%]', top: '[75.3%]' }),
  c2: css({ left: '[68.2%]', top: '[59%]' }),
  c3: css({ left: '[83.2%]', top: '[39%]' }),
  end: css({ left: '[96%]', top: '[12.5%]' }),
};

const CURVE = 'M40,270 C500,265 760,200 960,40';

export function RoiHeroChart() {
  const { t } = useTranslation('roi');

  return (
    <div aria-hidden="true" className={root}>
      <svg viewBox="0 0 1000 320" role="presentation">
        <line x1="40" y1="290" x2="975" y2="290" className={axis} />
        <line x1="40" y1="290" x2="40" y2="20" className={axis} />
        {[222, 155, 88].map((y) => (
          <line key={y} x1="40" y1={y} x2="975" y2={y} className={gridLine} />
        ))}
        <path
          d={`${CURVE} L960,290 L40,290 Z`}
          className={cx('hx-area', area)}
        />
        <path
          d="M40,270 L960,180"
          pathLength={1}
          className={cx('hx-lin', linear)}
        />
        <path d={CURVE} pathLength={1} className={cx('hx-exp', curve)} />
        <circle
          cx="456"
          cy="241"
          r="9"
          className={cx('hx-dot hx-d1', dotBase, dotFills.mint)}
        />
        <circle
          cx="682"
          cy="189"
          r="9"
          className={cx('hx-dot hx-d2', dotBase, dotFills.sky)}
        />
        <circle
          cx="832"
          cy="125"
          r="9"
          className={cx('hx-dot hx-d3', dotBase, dotFills.coral)}
        />
        <circle
          cx="960"
          cy="40"
          r="11"
          className={cx('hx-dot hx-d4', dotEnd)}
        />
        <text x="48" y="14" className={axisLabel}>
          {t('hero.chart.revenue')}
        </text>
        <text x="975" y="312" textAnchor="end" className={axisLabel}>
          {t('hero.chart.time')}
        </text>
        <text
          x="960"
          y="206"
          textAnchor="end"
          className={cx('hx-lt', linearLabel)}
        >
          {t('hero.chart.linear')}
        </text>
      </svg>
      <span className={cx('hx-chip hx-c1', chip, chipWide, chipPositions.c1)}>
        {t('hero.chart.opps')}
      </span>
      <span className={cx('hx-chip hx-c2', chip, chipWide, chipPositions.c2)}>
        {t('hero.chart.winRate')}
      </span>
      <span className={cx('hx-chip hx-c3', chip, chipPositions.c3)}>
        {t('hero.chart.acv')}
      </span>
      <span
        className={cx(
          'hx-chip hx-end',
          text({ variant: 'display-md-black' }),
          chip,
          chipEnd,
          chipPositions.end,
        )}
      >
        {t('hero.chart.multiplier')}
      </span>
    </div>
  );
}
