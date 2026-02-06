import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { badge, button } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import {
  DEFAULT_STACK_ITEMS,
  ModularStackGrid,
} from '../home/modular-stack-grid';
import { Container } from '../ui/Container';

export const HeroSection = () => {
  const { t } = useTranslation('technology');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section
      className={css({
        pt: '40',
        pb: '24',
        position: 'relative',
        textAlign: 'center',
      })}
    >
      <Container>
        <div
          className={css({
            maxW: '4xl',
            mx: 'auto',
            mb: '16',
            position: 'relative',
            zIndex: 10,
          })}
        >
          <span className={`${badge({ variant: 'sky' })} ${css({ mb: '10' })}`}>
            {t('hero.badge')}
          </span>

          <h1
            className={css({
              fontFamily: 'display',
              fontSize: { base: '5xl', md: '6xl' },
              fontWeight: 'bold',
              lineHeight: '0.95',
              letterSpacing: 'tight',
              mb: '10',
            })}
          >
            {t('hero.title.line1')}
            <br />
            {t('hero.title.line2')}{' '}
            <span className={css({ color: 'ocobo.sky', fontStyle: 'italic' })}>
              {t('hero.title.highlight')}
            </span>
          </h1>

          <p
            className={css({
              fontSize: 'xl',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
              color: 'gray.600',
              maxW: '2xl',
              mx: 'auto',
              mb: '12',
            })}
          >
            {t('hero.subtitle.before')}{' '}
            <span className={css({ fontWeight: 'bold' })}>
              {t('hero.subtitle.bold')}
            </span>
          </p>
        </div>

        <div
          className={`${flex({ justify: 'center' })} ${css({
            mb: '16',
            px: '4',
          })}`}
        >
          <ModularStackGrid
            items={DEFAULT_STACK_ITEMS}
            maxWidth="xl"
            animated
          />
        </div>

        <div
          className={flex({ direction: 'column', gap: '12', align: 'center' })}
        >
          <NavLink
            to={getLocalizedPath(url.contact)}
            className={button({ variant: 'cta', size: 'xl' })}
          >
            {t('hero.cta')}
          </NavLink>
        </div>

        <div
          className={`${flex({ justify: 'center' })} ${css({
            mt: '16',
            w: 'full',
            animation: 'bounce-slow',
          })}`}
        >
          <ChevronDown
            className={css({ color: 'ocobo.sky' })}
            size={24}
            strokeWidth={1.5}
          />
        </div>
      </Container>
    </section>
  );
};
