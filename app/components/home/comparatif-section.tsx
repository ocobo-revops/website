import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { DIAGNOSTIC_ID } from './challenges-section';
import { ComparatifGap } from './comparatif-gap';

// Bermia at 22px in the mockup: the display face, at the nearest size.
const columnTitle = cx(
  text({ variant: 'display-lg' }),
  css({
    fontSize: 'h3',
    lineHeight: 'tight',
    letterSpacing: 'normal',
    mb: '8',
  }),
);

const column = cx(
  card({ shadow: 'none', border: false }),
  css({
    position: 'relative',
    overflow: 'hidden',
    pt: '16',
    px: '10',
    pb: '10',
  }),
);

const list = cx(
  text({ variant: 'body' }),
  css({
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
    fontWeight: 'medium',
  }),
);

const item = css({ display: 'flex', gap: '3' });
const mark = css({ flexShrink: '0', w: '4', fontWeight: 'bold' });

/**
 * The "why Ocobo" block of the v2 home (`#pourquoi` in the mockup): the gap
 * between consultancies and integrators, then Ocobo against the others.
 */
export function ComparatifSection() {
  const { t } = useTranslation('home');
  const ocoboBenefits = t('comparatif.ocobo.items', {
    returnObjects: true,
  }) as string[];
  const otherIssues = t('comparatif.others.items', {
    returnObjects: true,
  }) as string[];

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

        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: 'minmax(0, 1fr)',
              md: 'repeat(2, minmax(0, 1fr))',
            },
            gap: '8',
          })}
        >
          <div className={cx(column, css({ color: 'dark' }))}>
            <span
              className={cx(
                text({ variant: 'label' }),
                css({
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  px: '4',
                  py: '1',
                  bg: 'yellow',
                  fontWeight: 'black',
                  letterSpacing: 'tag',
                  roundedBottomRight: 'lg',
                }),
              )}
            >
              {t('comparatif.ocobo.label')}
            </span>
            <h3 className={columnTitle}>{t('comparatif.ocobo.title')}</h3>
            <ul className={list}>
              {ocoboBenefits.map((benefit) => (
                <li key={benefit} className={item}>
                  <span
                    aria-hidden="true"
                    className={cx(mark, css({ color: 'mint' }))}
                  >
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cx(
              column,
              css({
                bg: 'white/5',
                borderWidth: '1px',
                borderColor: 'white/10',
                color: 'white',
              }),
            )}
          >
            <h3 className={cx(columnTitle, css({ color: 'white' }))}>
              {t('comparatif.others.title')}
            </h3>
            <ul className={cx(list, css({ color: 'gray.400' }))}>
              {otherIssues.map((issue) => (
                <li key={issue} className={item}>
                  <span
                    aria-hidden="true"
                    className={cx(mark, css({ color: 'coral' }))}
                  >
                    ✕
                  </span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={css({ mt: '14', textAlign: 'center' })}>
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
