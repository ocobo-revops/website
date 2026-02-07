import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';
import { badge, section } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';

type Intervention = {
  badge: string;
  badgeColor: 'yellow' | 'sky' | 'mint';
  subtitle: string;
  title: string;
  description: string;
};

const COLOR_MAP: Record<Intervention['badgeColor'], string> = {
  yellow: 'ocobo.yellow',
  sky: 'ocobo.sky',
  mint: 'ocobo.mint',
} as const;

const cardStyle = css({
  bg: 'white',
  borderWidth: '1px',
  borderColor: 'gray.100',
  p: '10',
  rounded: '2xl',
  display: 'flex',
  flexDirection: 'column',
  h: 'full',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all',
  transitionDuration: '300ms',
  _hover: {
    shadow: '2xl',
    translateY: '-1',
  },
});

export const InterventionsSection = () => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const items = t('interventions.items', {
    returnObjects: true,
  }) as Intervention[];

  return (
    <section className={section({ bg: 'white', padding: 'lg' })}>
      <Container>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '4xl',
            fontWeight: 'bold',
            color: 'ocobo.dark',
            mb: '4',
            textAlign: 'center',
          })}
        >
          {t('interventions.title')}
        </h2>
        <p
          className={css({
            textAlign: 'center',
            color: 'gray.600',
            maxW: '2xl',
            mx: 'auto',
            mb: '20',
          })}
        >
          {t('interventions.subtitle')}
        </p>

        <div
          className={grid({
            columns: { base: 1, md: 3 },
            gap: { base: '8', md: '10' },
          })}
        >
          {items.map((item) => {
            const color = COLOR_MAP[item.badgeColor];
            const anchor = item.badge.toLowerCase();
            return (
              <NavLink
                key={item.badge}
                to={getLocalizedPath(`${url.offer}#${anchor}`)}
                className={`group ${cardStyle} ${css({ textDecoration: 'none', color: 'inherit' })}`}
              >
                <div className={css({ mb: '8' })}>
                  <span
                    className={badge({
                      variant: item.badgeColor,
                    })}
                  >
                    {item.badge}
                  </span>
                  <p
                    className={css({
                      fontSize: 'sm',
                      fontWeight: 'black',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                      mt: '3',
                      ml: '1',
                      opacity: '0.7',
                      color,
                    })}
                  >
                    {item.subtitle}
                  </p>
                </div>
                <h3
                  className={css({
                    fontFamily: 'display',
                    fontSize: '3xl',
                    fontWeight: 'bold',
                    mb: '6',
                    color: 'ocobo.dark',
                    lineHeight: 'tight',
                    transition: 'colors',
                    _groupHover: { color: 'black' },
                  })}
                >
                  {item.title}
                </h3>
                <p
                  className={css({
                    color: 'gray.600',
                    fontSize: 'base',
                    lineHeight: 'relaxed',
                    flex: '1',
                    fontWeight: 'medium',
                  })}
                >
                  {item.description}
                </p>

                <div
                  className={css({
                    mt: '10',
                    pt: '6',
                    borderTopWidth: '1px',
                    borderTopColor: 'gray.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color,
                    opacity: '0',
                    transition: 'opacity',
                    transitionDuration: '300ms',
                    _groupHover: { opacity: '1' },
                  })}
                >
                  <span
                    className={css({
                      fontSize: '2xs',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 'widest',
                    })}
                  >
                    {t('interventions.more')}
                  </span>
                  <ArrowRight size={16} />
                </div>
              </NavLink>
            );
          })}
        </div>

        <div className={`${flex({ justify: 'center' })} ${css({ mt: '20' })}`}>
          <ButtonLink
            to={getLocalizedPath(url.offer)}
            variant="outline"
            size="lg"
          >
            {t('interventions.cta')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};
