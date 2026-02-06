import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { badge } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { HeroSplit } from '../home/hero-split';
import { Container } from '../ui/Container';
import { ArchitecturalGrid } from './architectural-grid';

export const HeroSection = () => {
  const { t } = useTranslation('offer');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section
      className={css({
        pt: { base: '8', md: '12', lg: '16' },
        pb: '4',
        position: 'relative',
      })}
    >
      <Container>
        <HeroSplit gap={16} className={css({ mb: '16' })}>
          <HeroSplit.Content className={css({ w: { lg: '1/2' } })}>
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
              <span className={css({ color: 'gray.400' })}>
                {t('hero.title.line2')}
              </span>
            </h1>
            <p
              className={css({
                fontSize: 'xl',
                color: 'gray.700',
                mb: '12',
                lineHeight: 'relaxed',
                fontWeight: 'medium',
                maxW: 'xl',
              })}
            >
              {t('hero.subtitle')}
            </p>
            <ButtonLink
              to={getLocalizedPath(url.contact)}
              variant="primary"
              size="lg"
            >
              {t('hero.cta')}
            </ButtonLink>
          </HeroSplit.Content>
          <HeroSplit.Media
            className={`${flex({
              justify: { base: 'center', lg: 'flex-end' },
              align: 'center',
            })} ${css({ w: { lg: '1/2' } })}`}
          >
            <ArchitecturalGrid />
          </HeroSplit.Media>
        </HeroSplit>

        <div
          className={`${center()} ${css({ w: 'full', animation: 'bounce-subtle' })}`}
        >
          <ChevronDown
            className={css({ color: 'ocobo.coral', opacity: '0.3' })}
            size={28}
            strokeWidth={1.5}
          />
        </div>
      </Container>
    </section>
  );
};
