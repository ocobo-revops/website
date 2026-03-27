import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { grid } from '@ocobo/styled-system/patterns';

import { SectionLabel } from './section-label';

type ThemeColor = 'yellow' | 'sky' | 'mint' | 'coral';
type Territory = { title: string; items: string[]; color: ThemeColor };

/* Pre-computed underline border colours */
const underlineStyles: Record<ThemeColor, string> = {
  yellow: css({ borderBottomColor: 'ocobo.yellow' }),
  sky: css({ borderBottomColor: 'ocobo.sky' }),
  mint: css({ borderBottomColor: 'ocobo.mint' }),
  coral: css({ borderBottomColor: 'ocobo.coral' }),
};

const dotStyles: Record<ThemeColor, string> = {
  yellow: css({ bg: 'ocobo.yellow' }),
  sky: css({ bg: 'ocobo.sky' }),
  mint: css({ bg: 'ocobo.mint' }),
  coral: css({ bg: 'ocobo.coral' }),
};

const titleBase = css({
  fontFamily: 'body',
  fontWeight: 'black',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'ocobo.dark',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  pb: '3',
  w: 'fit-content',
  mb: '8',
});

const dotBase = css({
  w: '2',
  h: '2',
  rounded: 'full',
  flexShrink: 0,
});

export const TerritoriesGrid = () => {
  const { t } = useTranslation('method');
  const territories = t('scope.territories', {
    returnObjects: true,
  }) as Territory[];

  return (
    <div
      className={css({
        position: 'relative',
        pt: '16',
        pb: '16',
        bg: 'gray.50/20',
      })}
    >
      <SectionLabel label={t('scope.labels.territories')} color="mint" />

      <div
        className={grid({
          columns: { base: 2, md: 4 },
          gap: '10',
        })}
        style={{ padding: '0 3rem', marginTop: '1.5rem' }}
      >
        {territories.map((territory, i) => (
          <div
            key={`terr-${i}`}
            className={css({
              p: '8',
              borderWidth: '1px',
              borderColor: 'gray.100/50',
              rounded: 'xl',
              bg: 'white',
              textAlign: 'left',
              shadow: 'sm',
            })}
          >
            <h4 className={cx(titleBase, underlineStyles[territory.color])}>
              {territory.title}
            </h4>

            <ul className={css({ spaceY: '4' })}>
              {territory.items.map((item) => (
                <li
                  key={item}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4',
                    fontSize: 'sm',
                    fontWeight: 'bold',
                    color: 'gray.500',
                  })}
                >
                  <div className={cx(dotBase, dotStyles[territory.color])} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
