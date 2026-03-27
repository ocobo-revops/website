import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { SectionLabel } from './section-label';

type ThemeColor = 'yellow' | 'sky' | 'mint' | 'coral';
type KpiColumn = { items: string[]; color: ThemeColor };

/* Pre-computed static colour maps for Panda CSS */
const borderStyles: Record<ThemeColor, string> = {
  sky: css({
    borderLeftColor: 'ocobo.sky/10',
    _hover: { borderLeftColor: 'ocobo.sky/50' },
  }),
  yellow: css({
    borderLeftColor: 'ocobo.yellow/10',
    _hover: { borderLeftColor: 'ocobo.yellow/50' },
  }),
  mint: css({
    borderLeftColor: 'ocobo.mint/10',
    _hover: { borderLeftColor: 'ocobo.mint/50' },
  }),
  coral: css({
    borderLeftColor: 'ocobo.coral/10',
    _hover: { borderLeftColor: 'ocobo.coral/50' },
  }),
};

const dotStyles: Record<ThemeColor, string> = {
  sky: css({ bg: 'ocobo.sky' }),
  yellow: css({ bg: 'ocobo.yellow' }),
  mint: css({ bg: 'ocobo.mint' }),
  coral: css({ bg: 'ocobo.coral' }),
};

const colBase = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  px: '5',
  borderLeftWidth: '2px',
  borderLeftStyle: 'solid',
  transition: 'colors',
  transitionDuration: '200ms',
});

const dotBase = css({
  w: '1',
  h: '1',
  rounded: 'full',
  flexShrink: 0,
  opacity: '0.3',
});

export const KpiGrid = () => {
  const { t } = useTranslation('method');
  const kpis = t('scope.kpis', { returnObjects: true }) as KpiColumn[];

  return (
    <div
      className={css({
        position: 'relative',
        py: '16',
        bg: 'white',
        borderBottomWidth: '1px',
        borderBottomColor: 'gray.100',
      })}
    >
      <SectionLabel label={t('scope.labels.kpi')} color="dark" />

      <div
        className={grid({
          columns: { base: 2, md: 6 },
          gap: '0',
        })}
        style={{ marginTop: '1.5rem', padding: '0 1rem' }}
      >
        {kpis.map((col, i) => (
          <div
            key={`kpi-${i}`}
            className={cx(colBase, borderStyles[col.color])}
          >
            {col.items.map((item) => (
              <div
                key={item}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2',
                })}
              >
                <div className={cx(dotBase, dotStyles[col.color])} />
                <span
                  className={css({
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: 'gray.500',
                    fontStyle: 'italic',
                    lineHeight: 'none',
                    whiteSpace: 'nowrap',
                  })}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
