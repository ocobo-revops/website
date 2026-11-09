import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';

import { DashboardIllustration } from './dashboard-illustration';

const pill = cx(
  text({ variant: 'label' }),
  css({
    display: 'inline-block',
    px: '4',
    py: '2',
    mb: '6',
    bg: 'mint',
    rounded: 'full',
  }),
);

const description = cx(
  text({ variant: 'body' }),
  css({ maxW: '2xl', mx: 'auto', fontWeight: 'semibold' }),
);

const highlight = css({
  textDecorationLine: 'underline',
  textDecorationColor: 'yellow',
  textDecorationThickness: '3px',
  textUnderlineOffset: '5px',
});

// The prototype draws the illustration at 340px under the copy.
const illustration = css({ maxW: '[340px]', mx: 'auto', mt: '2' });

const body = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  maxW: '2xl',
  mx: 'auto',
  mt: '2',
  pt: '9',
  borderTopWidth: '1px',
  borderColor: 'line',
  textAlign: 'left',
});

/**
 * The mission block of the v2 home (`#mission` in the mockup): the promise,
 * the illustration, then why most B2B companies need the machine we build.
 */
export function MissionSection() {
  const { t } = useTranslation('home');
  const paragraphs = t('mission.body', { returnObjects: true }) as string[];

  return (
    <section id="mission" className={section({ bg: 'gray', padding: 'lg' })}>
      <Container narrow className={css({ textAlign: 'center' })}>
        <span className={pill}>{t('mission.label')}</span>
        <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '7' }))}>
          {t('mission.title')}
        </h2>
        <p className={description}>
          <Trans
            t={t}
            i18nKey="mission.description"
            components={[<span key="highlight" className={highlight} />]}
          />
        </p>
        <div className={illustration}>
          <DashboardIllustration />
        </div>
        <div className={body}>
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={text({ variant: 'body', color: 'muted' })}
            >
              {paragraph}
            </p>
          ))}
          <p
            className={cx(
              text({ variant: 'body' }),
              css({ fontWeight: 'bold' }),
            )}
          >
            {t('mission.conclusion')}
          </p>
        </div>
      </Container>
    </section>
  );
}
