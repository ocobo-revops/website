import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { button } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { DashboardIllustration } from './dashboard-illustration';
import { HeroSplit } from './hero-split';

export const HeroSection = () => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const titleLines = t('hero.title.lines', { returnObjects: true }) as string[];

  return (
    <header
      className={css({
        pt: { base: '8', md: '12', lg: '16' },
        pb: '24',
        position: 'relative',
        overflow: 'hidden',
      })}
    >
      <Container>
        <HeroSplit
          gap={16}
          className={css({ position: 'relative', zIndex: '10' })}
        >
          <HeroSplit.Content>
            <h1
              className={css({
                fontFamily: 'display',
                fontSize: { base: '4xl', md: '6xl' },
                fontWeight: 'bold',
                color: 'ocobo.dark',
                mb: '10',
                lineHeight: '0.95',
                letterSpacing: 'tight',
                opacity: '0',
                animation: 'hero-reveal',
                animationDelay: '0.1s',
                animationFillMode: 'forwards',
              })}
            >
              {titleLines[0]}
              <br />
              {titleLines[1]}
              <br />
              <span className={css({ color: 'gray.400' })}>
                {titleLines[2]}
              </span>
            </h1>

            <p
              className={css({
                fontSize: { base: 'xl', md: '2xl' },
                color: 'gray.700',
                mb: '10',
                lineHeight: 'relaxed',
                fontWeight: 'medium',
                maxW: 'xl',
                opacity: '0',
                animation: 'hero-reveal',
                animationDelay: '0.2s',
                animationFillMode: 'forwards',
              })}
            >
              {t('hero.subtitle.before')}{' '}
              <span
                className={css({
                  textDecorationLine: 'underline',
                  textDecorationColor: 'ocobo.yellow',
                  textDecorationThickness: '3px',
                  textUnderlineOffset: '6px',
                })}
              >
                {t('hero.subtitle.highlight')}
              </span>
            </p>

            <div
              className={css({
                mb: '14',
                py: '1.5',
                opacity: '0',
                animation: 'hero-reveal',
                animationDelay: '0.3s',
                animationFillMode: 'forwards',
              })}
            >
              <p
                className={css({
                  fontFamily: 'display',
                  fontSize: { base: 'lg', md: 'xl' },
                  fontWeight: 'normal',
                  color: 'ocobo.dark',
                  lineHeight: 'tight',
                  letterSpacing: 'tight',
                })}
              >
                {t('hero.callout.before')}{' '}
                <span className={css({ fontWeight: 'bold' })}>
                  {t('hero.callout.emphasis')}
                </span>
              </p>
            </div>

            <div
              className={`${flex({
                direction: { base: 'column', sm: 'row' },
                gap: '6',
                align: 'flex-start',
              })} ${css({
                opacity: '0',
                animation: 'hero-reveal',
                animationDelay: '0.4s',
                animationFillMode: 'forwards',
              })}`}
            >
              <NavLink
                to={getLocalizedPath(url.contact)}
                className={button({ variant: 'primary', size: 'lg' })}
              >
                {t('hero.cta')}
              </NavLink>
            </div>
          </HeroSplit.Content>

          <HeroSplit.Media
            className={flex({
              justify: { base: 'center', lg: 'flex-end' },
              align: 'center',
            })}
          >
            <DashboardIllustration />
          </HeroSplit.Media>
        </HeroSplit>
      </Container>
    </header>
  );
};
