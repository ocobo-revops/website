import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, grid, vstack } from '@ocobo/styled-system/patterns';
import { badge, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

export function HeroSection() {
  const { t } = useTranslation('jobs');

  return (
    <section className={css({ mb: '32' })}>
      <Container>
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
              className={cx(
                text({ variant: 'display-xl', color: 'dark' }),
                css({
                  mb: '10',
                  whiteSpace: 'pre-line',
                }),
              )}
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
              <p className={css({ fontWeight: 'medium' })}>
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
                    className={text({
                      variant: 'display-card',
                      color: 'white',
                    })}
                  >
                    {t('hero.cardLabel')}
                  </span>
                </div>
                <div
                  className={cx(
                    'group',
                    css({ rounded: '3xl', overflow: 'hidden' }),
                  )}
                >
                  <img
                    src="/images/jobs/seminaire.jpeg"
                    alt={t('hero.seminaireAlt')}
                    className={css({
                      w: 'full',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      rounded: '3xl',
                      filter: 'grayscale(100%)',
                      transition: 'all 500ms',
                      _groupHover: { filter: 'grayscale(0)' },
                    })}
                  />
                </div>
              </div>
              {/* Right column */}
              <div className={vstack({ gap: '6', alignItems: 'stretch' })}>
                <div
                  className={cx(
                    'group',
                    css({ rounded: '3xl', overflow: 'hidden' }),
                  )}
                >
                  <img
                    src="/images/jobs/cafet.jpeg"
                    alt={t('hero.cafetAlt')}
                    className={css({
                      w: 'full',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      rounded: '3xl',
                      filter: 'grayscale(100%)',
                      transition: 'all 500ms',
                      _groupHover: { filter: 'grayscale(0)' },
                    })}
                  />
                </div>
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
                    className={cx(
                      text({ variant: 'display-lg-bold', color: 'dark' }),
                      css({ whiteSpace: 'pre-line' }),
                    )}
                  >
                    {t('hero.cardStat')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
