import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { Container } from '../ui/Container';
import { DataIllustration } from './data-illustration';

export const HeroSection = () => {
  const { t } = useTranslation('about');

  return (
    <section
      className={css({ pt: { base: '8', md: '12', lg: '16' }, pb: '10' })}
    >
      <Container>
        <div
          className={css({
            textAlign: 'center',
            maxW: '4xl',
            mx: 'auto',
            mb: '20',
          })}
        >
          <h1
            className={cx(
              text({ variant: 'display-xl', color: 'dark' }),
              css({
                mb: '8',
                lineHeight: '0.9',
              }),
            )}
          >
            {t('hero.title.line1')}
            <br />
            {t('hero.title.line2')}{' '}
            <span className={css({ color: 'ocobo.yellow' })}>
              {t('hero.title.highlight')}
            </span>
          </h1>
          <p
            className={css({
              fontSize: 'xl',
              color: 'gray.700',
              lineHeight: 'relaxed',
              mb: '6',
              fontWeight: 'medium',
            })}
          >
            {t('hero.subtitle')}
          </p>
          <p
            className={css({
              color: 'gray.500',
              lineHeight: 'relaxed',
              fontSize: 'lg',
            })}
          >
            {t('hero.description')}
          </p>
        </div>
        <DataIllustration />
      </Container>
    </section>
  );
};
