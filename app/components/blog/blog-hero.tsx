import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { badge, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

const BlogHero: React.FunctionComponent = () => {
  const { t } = useTranslation('blog');

  return (
    <header
      className={css({
        bg: 'sky.light',
        pt: { base: 24, lg: 32 },
        pb: { base: 16, lg: 24 },
      })}
    >
      <Container>
        <div className={css({ maxWidth: '2xl' })}>
          <span
            className={cx(
              badge({ variant: 'sky' }),
              css({ mb: '6', display: 'inline-block' }),
            )}
          >
            {t('hero.badge')}
          </span>
          <h1
            className={cx(
              text({ variant: 'display-xl', color: 'dark' }),
              css({ mb: '6' }),
            )}
          >
            {t('hero.title')}
          </h1>
          <p
            className={css({
              fontSize: { base: 'lg', md: 'xl' },
              color: 'gray.600',
              lineHeight: 'relaxed',
              maxWidth: 'lg',
            })}
          >
            {t('hero.description')}
          </p>
        </div>
      </Container>
    </header>
  );
};

BlogHero.displayName = 'BlogHero';

export { BlogHero };
