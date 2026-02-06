import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { button, section } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { DEFAULT_STACK_ITEMS, ModularStackGrid } from './modular-stack-grid';

interface StackSectionProps {
  showTechnology?: boolean;
}

export const StackSection = ({ showTechnology = true }: StackSectionProps) => {
  const { t } = useTranslation('home');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section className={section({ bg: 'white', padding: 'lg' })}>
      <Container className={css({ textAlign: 'center' })}>
        <h2
          className={css({
            fontFamily: 'display',
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '6',
          })}
        >
          {t('stack.title')}
        </h2>
        <p
          className={css({
            color: 'gray.500',
            mb: '16',
            maxW: '3xl',
            mx: 'auto',
            fontSize: 'lg',
            fontWeight: 'medium',
          })}
        >
          {t('stack.description')}
        </p>

        <div className={css({ mb: '16' })}>
          <ModularStackGrid items={DEFAULT_STACK_ITEMS} showLabels />
        </div>

        <div
          className={`${flex({ direction: 'column', align: 'center' })} ${css({ mt: '8' })}`}
        >
          {showTechnology ? (
            <NavLink
              to={getLocalizedPath(url.technology)}
              className={button({ variant: 'outline', size: 'lg' })}
            >
              {t('stack.cta')}
            </NavLink>
          ) : null}
          <p
            className={css({
              mt: '6',
              color: 'gray.400',
              fontSize: 'sm',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
            })}
          >
            {t('stack.tagline')}
          </p>
        </div>
      </Container>
    </section>
  );
};
