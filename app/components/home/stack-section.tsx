import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { flex } from '@ocobo/styled-system/patterns';
import { section, text } from '@ocobo/styled-system/recipes';

import { ButtonLink } from '~/components/ui/button-link';
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
        <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '6' }))}>
          {t('stack.title.line1')}
          <br />
          <span className={css({ color: 'gray.400' })}>
            {t('stack.title.line2')}
          </span>
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
          <strong
            className={css({
              display: 'block',
              mb: '3',
              color: 'dark',
              fontWeight: 'bold',
            })}
          >
            {t('stack.tagline')}
          </strong>
          {t('stack.description')}
        </p>

        <div className={css({ mb: '16' })}>
          <ModularStackGrid items={DEFAULT_STACK_ITEMS} showLabels />
        </div>

        {showTechnology ? (
          <div
            className={`${flex({ direction: 'column', align: 'center' })} ${css({ mt: '8' })}`}
          >
            <ButtonLink
              to={getLocalizedPath(url.technology)}
              variant="outline"
              size="lg"
            >
              {t('stack.cta')}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
};
