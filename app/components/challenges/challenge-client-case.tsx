import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { ButtonLink } from '~/components/ui/button-link';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { ClientCaseSection } from '~/modules/challenge-reference-sections';
import type { ChallengeKey } from '~/modules/challenge-schema';
import { url } from '~/utils/url';

import { challengePill } from './challenge-pill';

// A metric is not a link: it keeps the resting card, with no hover lift.
const metricCard = cx(card(), css({ gap: '2' }));

const layout = css({ display: 'grid', gap: '12', alignItems: 'center' });
// The text takes the full width when the case has no metric.
const withMetrics = css({
  gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
});

type ChallengeClientCaseProps = {
  clientCase: ClientCaseSection;
  challenge: ChallengeKey;
};

export function ChallengeClientCase({
  clientCase,
  challenge,
}: ChallengeClientCaseProps) {
  const { t } = useTranslation('challenges');
  const getLocalizedPath = useLocalizedPathname();
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={section({ bg: 'white' })}>
      <Container
        className={cx(layout, clientCase.metrics.length > 0 && withMetrics)}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
            alignItems: 'flex-start',
          })}
        >
          <span className={challengePill[challenge]}>
            {t('clientCase.eyebrow')}
          </span>
          <h2 id={titleId} className={text({ variant: 'display-lg' })}>
            {clientCase.headline}
          </h2>
          {clientCase.summary ? (
            <p className={text({ variant: 'body', color: 'muted' })}>
              {clientCase.summary}
            </p>
          ) : null}
          {clientCase.storySlug ? (
            <ButtonLink
              to={getLocalizedPath(`${url.stories}/${clientCase.storySlug}`)}
              variant="outline"
              size="md"
            >
              {t('clientCase.cta')}
            </ButtonLink>
          ) : null}
        </div>

        {clientCase.metrics.length > 0 ? (
          <ul
            className={css({
              display: 'grid',
              gridTemplateColumns: {
                base: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
              },
              gap: '6',
            })}
          >
            {clientCase.metrics.map((metric, index) => (
              // Metrics can repeat in a draft: the position keeps keys unique.
              <li key={index} className={metricCard}>
                <span className={text({ variant: 'display-lg' })}>
                  {metric.value}
                </span>
                <span className={text({ variant: 'small', color: 'muted' })}>
                  {metric.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
