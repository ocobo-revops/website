import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex, grid } from '@ocobo/styled-system/patterns';

export const ArchitecturalGrid = () => {
  const { t } = useTranslation('offer');
  const blockLabels = t('hero.grid.blocks', {
    returnObjects: true,
  }) as string[];
  const footerLabels = t('hero.grid.footerLabels', {
    returnObjects: true,
  }) as string[];

  return (
    <div
      className={css({
        position: 'relative',
        w: 'full',
        maxW: '500px',
        animation: 'float-grid',
      })}
    >
      <div
        className={flex({
          align: 'stretch',
          gap: '4',
          position: 'relative',
        })}
      >
        <div
          className={flex({
            direction: 'column',
            align: 'center',
            justify: 'center',
            py: '4',
            shrink: '0',
          })}
        >
          <div
            className={css({
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              fontFamily: 'display',
              fontWeight: 'bold',
              color: 'ocobo.dark/40',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '0.6em',
              mb: '4',
            })}
          >
            {t('hero.grid.axis')}
          </div>
          <div
            className={css({
              w: '1px',
              bg: 'ocobo.dark/20',
              flexGrow: 1,
              transformOrigin: 'top',
              animation: 'blueprint-in',
            })}
            style={{ animationDelay: '0.2s' }}
          />
        </div>

        <div
          className={css({
            position: 'relative',
            zIndex: '10',
            bg: 'white',
            borderWidth: '2px',
            borderColor: 'ocobo.dark',
            p: '8',
            shadow: 'offset',
            flexGrow: 1,
          })}
        >
          <div
            className={`${grid({ columns: 2, gap: '4' })} ${css({
              mb: '4',
            })}`}
          >
            {[
              {
                label: blockLabels[0],
                color: 'ocobo.yellow',
                bg: 'ocobo.yellow.light',
                delay: '0.4s',
              },
              {
                label: blockLabels[1],
                color: 'ocobo.sky',
                bg: 'ocobo.sky.light',
                delay: '0.5s',
              },
              {
                label: blockLabels[2],
                color: 'ocobo.mint',
                bg: 'ocobo.mint.light',
                delay: '0.6s',
              },
              {
                label: blockLabels[3],
                color: 'ocobo.coral',
                bg: 'ocobo.coral.light',
                delay: '0.7s',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${center({
                  opacity: '0',
                  animation: 'box-pop',
                  h: '24',
                  bg: item.bg,
                  borderWidth: '1px',
                  borderColor: 'ocobo.dark',
                  transition: 'transform',
                  transitionDuration: '300ms',
                  cursor: 'pointer',
                  _hover: { transform: 'translateY(-4px)' },
                })} group`}
                style={{ animationDelay: item.delay }}
              >
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    transition: 'colors',
                    transitionDuration: '300ms',
                    fontSize: { base: 'xs', md: 'sm' },
                    _groupHover: { color: item.color },
                  })}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className={css({
              h: '2',
              bg: 'ocobo.dark',
              w: 'full',
              mb: '4',
              transformOrigin: 'left',
              animation: 'blueprint-in',
            })}
          />

          <div
            className={flex({
              justify: 'space-between',
              fontSize: 'xs',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              color: 'ocobo.dark/60',
            })}
          >
            {footerLabels.map((label, index) => (
              <span
                key={label}
                className={css({ opacity: '0', animation: 'box-pop' })}
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
