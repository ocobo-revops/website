import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { DIAGNOSTIC_ID } from './challenges-section';
import { ComparatifGap } from './comparatif-gap';

/**
 * The "why Ocobo" block of the v2 home (`#pourquoi` in the mockup): the gap
 * between consultancies and integrators, and Ocobo in between.
 */
export function ComparatifSection() {
  const { t } = useTranslation('home');

  return (
    <section id="pourquoi" className={section({ bg: 'dark', padding: 'lg' })}>
      <Container>
        <div className={css({ textAlign: 'center', mb: '16' })}>
          <h2
            className={cx(
              text({ variant: 'display-lg', color: 'white' }),
              css({ mb: '5' }),
            )}
          >
            {t('comparatif.title.line1')}
            <br />
            <span className={css({ color: 'gray.400' })}>
              {t('comparatif.title.line2')}
            </span>
          </h2>
          <p
            className={cx(
              text({ variant: 'body' }),
              css({ color: 'gray.400', fontWeight: 'medium' }),
            )}
          >
            {t('comparatif.subtitle')}
          </p>
        </div>

        <ComparatifGap />

        <div className={css({ mt: '2', textAlign: 'center' })}>
          <a
            href={`#${DIAGNOSTIC_ID}`}
            className={button({ variant: 'yellow', size: 'lg' })}
          >
            {t('comparatif.cta')}
          </a>
        </div>
      </Container>
    </section>
  );
}
