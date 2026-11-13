import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';
import { badge, card, section, text } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { SquadPhoto } from './squad-photo';

type Intervention = {
  badge: string;
  badgeColor: 'yellow' | 'sky' | 'mint';
  subtitle: string;
  title: string;
  description: string;
};

const cardStyle = cx(
  'group',
  card({ padding: 'lg' }),
  css({
    flexDirection: 'column',
    h: 'full',
    color: 'dark',
    textDecoration: 'none',
    transitionProperty: 'common',
    transitionDuration: 'slow',
    _hover: { boxShadow: 'hover', transform: 'translateY(-4px)' },
    _motionReduce: { _hover: { transform: 'none' } },
  }),
);

export const InterventionsSection = () => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();
  const items = t('interventions.items', {
    returnObjects: true,
  }) as Intervention[];

  return (
    <section
      id="methode"
      className={cx(
        section({ bg: 'gray', padding: 'lg' }),
        css({ scrollMarginTop: '24' }),
      )}
    >
      <Container>
        <h2
          className={cx(
            text({ variant: 'display-lg' }),
            css({ mb: '4', textAlign: 'center' }),
          )}
        >
          {t('interventions.title')}
        </h2>
        <p
          className={cx(
            text({ variant: 'body', color: 'muted' }),
            css({ textAlign: 'center', maxW: '2xl', mx: 'auto', mb: '20' }),
          )}
        >
          {t('interventions.subtitle')}
        </p>

        <SquadPhoto />

        <div
          className={grid({
            columns: { base: 1, md: 3 },
            gap: '8',
          })}
        >
          {items.map((item, index) => {
            const anchor = item.badge.toLowerCase();
            return (
              <NavLink
                key={item.badge}
                to={getLocalizedPath(`${url.offer}#${anchor}`)}
                className={cardStyle}
              >
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '4',
                  })}
                >
                  <span className={badge({ variant: item.badgeColor })}>
                    {item.subtitle}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      text({ variant: 'display-lg' }),
                      css({
                        fontSize: '4xl',
                        lineHeight: 'none',
                        color: 'gray.light',
                      }),
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3
                  className={cx(
                    text({ variant: 'display-md-black' }),
                    css({ mt: '5', mb: '4' }),
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cx(
                    text({ variant: 'body', color: 'muted' }),
                    css({ flex: '1' }),
                  )}
                >
                  {item.description}
                </p>
                <span
                  className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2',
                    mt: '7',
                    pt: '5',
                    borderTopWidth: '1px',
                    borderColor: 'gray.50',
                    fontWeight: 'semibold',
                  })}
                >
                  {t('interventions.more')}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className={css({
                      transitionProperty: 'common',
                      transitionDuration: 'slow',
                      _groupHover: { transform: 'translateX(4px)' },
                      _motionReduce: { _groupHover: { transform: 'none' } },
                    })}
                  />
                </span>
              </NavLink>
            );
          })}
        </div>

        <div className={`${flex({ justify: 'center' })} ${css({ mt: '14' })}`}>
          <ButtonLink
            to={getLocalizedPath(url.method)}
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
