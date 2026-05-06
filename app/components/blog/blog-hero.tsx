import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

const BlogHero: React.FunctionComponent = () => {
  const { t } = useTranslation('blog');

  return (
    <section
      className={css({
        pt: '32',
        maxW: '7xl',
        mx: 'auto',
        px: { base: '4', sm: '6', lg: '8' },
      })}
    >
      <div
        className={css({
          pb: '12',
          borderBottomWidth: '1px',
          borderColor: 'gray.200',
        })}
      >
        <div className={css({ maxW: '2xl' })}>
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
            className={css({
              fontFamily: 'display',
              fontSize: '5xl',
              fontWeight: 'bold',
              color: 'ocobo.dark',
              mb: '6',
            })}
          >
            {t('hero.title')}
          </h1>
          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.600',
              fontWeight: 'medium',
            })}
          >
            {t('hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

BlogHero.displayName = 'BlogHero';

export { BlogHero };
