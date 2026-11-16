import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { ContactCta } from '~/components/ui/contact-cta';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

type ClosingSectionProps = {
  /** Shows the "Join us" card, which links to the jobs page. */
  jobsEnabled: boolean;
};

// Static literals per layout: Panda drops a value computed at runtime.
const oneDoor = css({ display: 'grid', gap: '6' });
const twoDoors = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
  gap: '6',
});
const column = css({ gap: '5', alignItems: 'flex-start' });

/** Two closing doors: work with the Studio, or join it. */
export function ClosingSection({ jobsEnabled }: ClosingSectionProps) {
  const { t } = useTranslation('studio');
  const getLocalizedPath = useLocalizedPathname();

  return (
    <section className={section({ bg: 'yellow' })}>
      <Container className={jobsEnabled ? twoDoors : oneDoor}>
        <div className={cx(card({ padding: 'xl' }), column)}>
          <p className={text({ variant: 'label', color: 'muted' })}>
            {t('closing.work.eyebrow')}
          </p>
          <h2 className={text({ variant: 'display-lg' })}>{t('cta.title')}</h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('cta.subtitle')}
          </p>
          <ContactCta className={css({ mt: 'auto' })}>
            {t('cta.button')}
          </ContactCta>
        </div>

        {jobsEnabled && (
          <div
            className={cx(
              card({ padding: 'xl', border: false }),
              column,
              // The card recipe has no dark tone yet (open question on #244).
              css({ bg: 'dark', color: 'white' }),
            )}
          >
            <p className={text({ variant: 'label', color: 'muted-light' })}>
              {t('closing.join.eyebrow')}
            </p>
            <h2 className={text({ variant: 'display-lg', color: 'white' })}>
              {t('closing.join.title')}
            </h2>
            <p className={text({ variant: 'body', color: 'muted-light' })}>
              {t('closing.join.text')}
            </p>
            <ButtonLink
              to={getLocalizedPath(url.jobs)}
              variant="white"
              className={css({ mt: 'auto' })}
            >
              {t('closing.join.cta')}
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
