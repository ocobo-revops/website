import { Heart, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { center, grid, vstack } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

const VALUE_STYLES = [
  {
    iconClass: css({ color: 'ocobo.yellow' }),
    cardClass: css({
      borderColor: 'ocobo.yellow',
      bg: 'yellow.light',
    }),
    Icon: Sparkles,
  },
  {
    iconClass: css({ color: 'ocobo.sky' }),
    cardClass: css({
      borderColor: 'ocobo.sky',
      bg: 'sky.light',
    }),
    Icon: ShieldCheck,
  },
  {
    iconClass: css({ color: 'ocobo.mint' }),
    cardClass: css({
      borderColor: 'ocobo.mint',
      bg: 'mint.light',
    }),
    Icon: Zap,
  },
  {
    iconClass: css({ color: 'ocobo.coral' }),
    cardClass: css({
      borderColor: 'ocobo.coral',
      bg: 'coral.light',
    }),
    Icon: Heart,
  },
] as const;

type ValueItem = { title: string; desc: string };

export function ValuesSection() {
  const { t } = useTranslation('jobs');
  const items = t('values.items', { returnObjects: true }) as ValueItem[];

  return (
    <section
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        py: '24',
        mb: '16',
      })}
    >
      <div className={css({ textAlign: 'center', mb: '20' })}>
        <span
          className={`${badge({ variant: 'coral' })} ${css({ mb: '6', display: 'inline-block' })}`}
        >
          {t('values.badge')}
        </span>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: { base: '4xl', md: '6xl' },
            fontWeight: 'black',
            color: 'ocobo.dark',
            letterSpacing: 'tight',
          })}
        >
          {t('values.title')}
        </h2>
      </div>

      <div className={grid({ columns: { base: 1, md: 2, lg: 4 }, gap: '8' })}>
        {items.map((val, i) => {
          const { iconClass, cardClass, Icon } = VALUE_STYLES[i % 4];
          return (
            <div
              key={val.title}
              className={cx(
                vstack({ gap: '6', alignItems: 'stretch' }),
                css({
                  p: '10',
                  rounded: '3xl',
                  borderWidth: '1px',
                  transition: 'all',
                  transitionDuration: '500ms',
                  _hover: { shadow: 'xl' },
                }),
                cardClass,
              )}
            >
              <div
                className={cx(
                  center(),
                  css({
                    w: '14',
                    h: '14',
                    bg: 'white',
                    rounded: '2xl',
                    shadow: 'sm',
                    borderWidth: '1px',
                    borderColor: 'black/5',
                  }),
                )}
              >
                <Icon size={24} className={iconClass} />
              </div>
              <h3
                className={css({
                  fontFamily: 'display',
                  fontSize: '2xl',
                  fontWeight: 'bold',
                  color: 'ocobo.dark',
                  lineHeight: 'tight',
                })}
              >
                {val.title}
              </h3>
              <p
                className={css({
                  color: 'gray.600',
                  fontSize: 'sm',
                  fontWeight: 'medium',
                  lineHeight: 'relaxed',
                })}
              >
                {val.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
