import { useTranslation } from 'react-i18next';

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

// The prototype draws the illustration at 340px under the copy.
const illustration = css({ maxW: '[340px]', mx: 'auto', mt: '2' });

/**
 * The mission block of the v2 home (`#mission` in the mockup), with the
 * production copy. The mockup's longer copy and manifesto link wait for
 * Ocobo validation.
 */
export function MissionSection() {
  const { t } = useTranslation('home');

  return (
    <section id="mission" className={section({ bg: 'gray', padding: 'lg' })}>
      <Container narrow className={css({ textAlign: 'center' })}>
        <span className={pill}>{t('mission.label')}</span>
        <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '7' }))}>
          {t('mission.title')}
        </h2>
        <p className={description}>{t('mission.description')}</p>
        <div className={illustration}>
          <DashboardIllustration />
        </div>
      </Container>
    </section>
  );
}
