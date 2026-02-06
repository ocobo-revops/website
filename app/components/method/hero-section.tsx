import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { badge, button } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { AttioPillarsIllustration } from './attio-pillars-illustration';

export const HeroSection = () => {
  const { t } = useTranslation('method');
  const getLocalizedPath = useLocalizedPathname();
  const labels = t('hero.illustration.labels', {
    returnObjects: true,
  }) as string[];

  return (
    <section
      className={css({
        pt: { base: '8', md: '12', lg: '16' },
        pb: '16',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
      })}
    >
      <Container>
        <div
          className={css({
            maxW: '4xl',
            mx: 'auto',
            mb: '8',
            position: 'relative',
            zIndex: '10',
          })}
        >
          <span
            className={`${badge({ variant: 'yellow' })} ${css({ mb: '10' })}`}
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
            })}
          >
            {t('hero.title.line1')}
            <br />
            {t('hero.title.line2')}{' '}
            <span
              className={css({ color: 'ocobo.yellow', fontStyle: 'italic' })}
            >
              {t('hero.title.highlight')}
            </span>
          </h1>

          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.700',
              mb: '8',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
              maxW: '2xl',
              mx: 'auto',
            })}
          >
            <span className={css({ fontWeight: 'bold' })}>
              {t('hero.subtitle.bold')}
            </span>{' '}
            {t('hero.subtitle.rest')}
          </p>
        </div>

        <div
          className={`${center()} ${css({
            mb: '10',
            position: 'relative',
            zIndex: '10',
            px: '4',
          })}`}
        >
          <AttioPillarsIllustration
            labels={[labels[0], labels[1], labels[2], labels[3]]}
          />
        </div>

        <div
          className={`${flex({ direction: 'column', align: 'center', gap: '12' })} ${css(
            {
              position: 'relative',
              zIndex: '10',
            },
          )}`}
        >
          <div
            className={css({
              fontStyle: 'italic',
              fontWeight: 'medium',
              color: 'gray.400',
              fontSize: 'base',
              lineHeight: 'relaxed',
              maxW: 'md',
            })}
          >
            {t('hero.quote')}
          </div>

          <NavLink
            to={getLocalizedPath(url.contact)}
            className={`${button({ variant: 'cta', size: 'xl' })} ${css({
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              fontWeight: 'bold',
            })}`}
          >
            {t('hero.cta')}
          </NavLink>
        </div>

        <div
          className={`${center()} ${css({
            mt: '16',
            w: 'full',
            animation: 'bounce-slow',
          })}`}
        >
          <ChevronDown
            className={css({ color: 'gray.200' })}
            size={24}
            strokeWidth={1.5}
          />
        </div>
      </Container>
    </section>
  );
};
