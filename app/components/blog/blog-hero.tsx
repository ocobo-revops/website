import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

const BlogHero: React.FunctionComponent = () => {
  const { t } = useTranslation('blog');

  return (
    <header
      className={css({
        bg: 'white',
        pt: { base: 24, lg: 32 },
        pb: { base: 12, lg: 20 },
        borderBottomWidth: '1px',
        borderColor: 'gray.200',
      })}
    >
      <Container>
        <div className={css({ maxWidth: '2xl' })}>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              color: 'ocobo.coral',
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              fontSize: 'sm',
              mb: '2',
              display: 'block',
            })}
          >
            {t('hero.eyebrow')}
          </span>
          <h1
            className={cx(
              text({ variant: 'display-xl', color: 'dark' }),
              css({
                mb: '6',
                fontSize: { base: '4xl', md: '5xl' },
              }),
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
