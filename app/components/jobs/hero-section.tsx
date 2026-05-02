import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, grid, vstack } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

export function HeroSection() {
  const { t } = useTranslation('jobs');

  return (
    <section
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
        mb: '32',
      })}
    >
      <div
        className={flex({
          direction: { base: 'column', lg: 'row' },
          align: 'start',
          gap: '20',
        })}
      >
        {/* Left — text */}
        <div className={css({ lg: { w: '1/2' } })}>
          <span
            className={`${badge({ variant: 'mint' })} ${css({ mb: '10', display: 'inline-block' })}`}
          >
            {t('hero.badge')}
          </span>
          <h1
            className={css({
              fontFamily: 'display',
              fontSize: { base: '5xl', md: '6xl' },
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '10',
              lineHeight: '0.95',
              letterSpacing: 'tight',
              whiteSpace: 'pre-line',
            })}
          >
            {t('hero.title')}
          </h1>
          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.700',
              mb: '8',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
            })}
          >
            {t('hero.intro')}
          </p>
          <div
            className={css({
              borderLeftWidth: '4px',
              borderColor: 'ocobo.yellow',
              pl: '8',
              py: '2',
              color: 'gray.600',
              lineHeight: 'relaxed',
            })}
          >
            <p className={css({ fontWeight: 'medium' })}>{t('hero.quote')}</p>
            <p className={css({ color: 'gray.400', fontSize: 'sm', mt: '4' })}>
              {t('hero.quoteSub')}
            </p>
          </div>
        </div>

        {/* Right — image grid */}
        <div
          className={css({
            lg: { w: '1/2' },
            position: 'relative',
            mt: { base: '12', lg: '0' },
          })}
        >
          <div className={grid({ columns: 2, gap: '6' })}>
            {/* Left column — offset down */}
            <div
              className={`${vstack({ gap: '6', alignItems: 'stretch' })} ${css({ mt: '12' })}`}
            >
              <div
                className={`${vstack({ justify: 'space-between', alignItems: 'stretch' })} ${css(
                  {
                    bg: 'ocobo.dark',
                    color: 'white',
                    p: '8',
                    aspectRatio: '1',
                    rounded: '3xl',
                    shadow: 'xl',
                  },
                )}`}
              >
                <Lightbulb
                  size={32}
                  className={css({ color: 'ocobo.yellow' })}
                />
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    fontSize: 'xl',
                  })}
                >
                  {t('hero.cardLabel')}
                </span>
              </div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                alt="Team collaboration"
                className={css({
                  w: 'full',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  rounded: '3xl',
                  filter: 'grayscale(100%)',
                })}
              />
            </div>
            {/* Right column */}
            <div className={vstack({ gap: '6', alignItems: 'stretch' })}>
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80"
                alt="Team meeting"
                className={css({
                  w: 'full',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  rounded: '3xl',
                  filter: 'grayscale(100%)',
                })}
              />
              <div
                className={`${vstack({ justify: 'space-between', alignItems: 'stretch' })} ${css(
                  {
                    bg: 'ocobo.yellow',
                    p: '8',
                    aspectRatio: '1',
                    rounded: '3xl',
                    shadow: 'xl',
                  },
                )}`}
              >
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    fontSize: '4xl',
                    color: 'ocobo.dark',
                    whiteSpace: 'pre-line',
                  })}
                >
                  {t('hero.cardStat')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
