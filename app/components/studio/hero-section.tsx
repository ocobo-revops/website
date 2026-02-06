import { ChevronDown } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { badge, button } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { TeamPhotoIllustration } from './team-photo-illustration';

export const HeroSection = () => {
  const { t } = useTranslation('studio');
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
        <div className={css({ maxW: '4xl', mx: 'auto', mb: '16' })}>
          <span
            className={`${badge({ variant: 'mint' })} ${css({ mb: '10' })}`}
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
            <span className={css({ color: 'ocobo.mint', fontStyle: 'italic' })}>
              {t('hero.title.highlight')}
            </span>
          </h1>

          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.700',
              mb: '12',
              lineHeight: 'relaxed',
              fontWeight: 'medium',
              maxW: '2xl',
              mx: 'auto',
            })}
          >
            <Trans
              i18nKey="hero.subtitle"
              ns="studio"
              components={{
                bold: <span className={css({ fontWeight: 'bold' })} />,
              }}
            />
          </p>
        </div>

        <TeamPhotoIllustration />

        <div
          className={`${flex({ direction: 'column', gap: '12', align: 'center' })} ${css({ mt: '16' })}`}
        >
          <div
            className={css({
              fontStyle: 'italic',
              fontWeight: 'medium',
              color: 'gray.400',
              fontSize: 'sm',
              lineHeight: 'relaxed',
              maxW: 'md',
            })}
          >
            {t('hero.quote')}
          </div>

          <NavLink
            to={getLocalizedPath(url.contact)}
            className={button({ variant: 'cta', size: 'xl' })}
          >
            {t('hero.cta')}
          </NavLink>
        </div>

        <div
          className={`${center()} ${css({
            mt: '16',
            width: 'full',
            animation: 'bounce-slow',
          })}`}
        >
          <ChevronDown
            className={css({ color: 'ocobo.mint' })}
            size={24}
            strokeWidth={1.5}
          />
        </div>
      </Container>
    </section>
  );
};
