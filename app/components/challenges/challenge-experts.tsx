import { ArrowRight } from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { button, section, text } from '@ocobo/styled-system/recipes';

import { PersonCard } from '~/components/member/person-card';
import { Container } from '~/components/ui/Container';
import type { ExpertCard } from '~/modules/challenge-reference-sections';
import type { ChallengeKey } from '~/modules/challenge-schema';

import { DIAGNOSTIC_ID } from './challenge-diagnostic';
import { challengePill } from './challenge-pill';

/** Anchor of the block, as in the prototype. */
export const EXPERTS_ID = 'experts';

/** Tools a card shows on its back (#235). */
const TOOL_LIMIT = 4;

type ChallengeExpertsProps = {
  experts: ExpertCard[];
  challenge: ChallengeKey;
  /** Challenge name, in the card label ("Expert Revenue Performance"). */
  challengeName: string;
  /** Shows the CTA, which scrolls to the diagnostic block. */
  hasDiagnostic: boolean;
  /** Drops the top padding, so the panel sits under the client case. */
  afterClientCase: boolean;
};

export function ChallengeExperts({
  experts,
  challenge,
  challengeName,
  hasDiagnostic,
  afterClientCase,
}: ChallengeExpertsProps) {
  const { t } = useTranslation('challenges');
  const titleId = useId();

  return (
    // The page root sets `colorPalette` to the challenge colour (route file).
    <section
      id={EXPERTS_ID}
      aria-labelledby={titleId}
      className={cx(
        section({ bg: 'white' }),
        afterClientCase ? css({ pt: '0' }) : undefined,
      )}
    >
      <Container>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              xl: 'minmax(0, 1fr) minmax(0, 1.15fr)',
            },
            gap: '12',
            alignItems: 'center',
            bg: 'colorPalette.light',
            rounded: '3xl',
            px: { base: '5', md: '12' },
            py: { base: '8', md: '12' },
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              alignItems: 'flex-start',
            })}
          >
            <span className={challengePill[challenge]}>
              {t('experts.eyebrow')}
            </span>
            <h2 id={titleId} className={text({ variant: 'display-lg' })}>
              {t('experts.title')}
            </h2>
            {/* The muted grey falls under 4.5:1 on the tinted panel. */}
            <p
              className={cx(
                text({ variant: 'body' }),
                css({ color: 'gray.600' }),
              )}
            >
              {t('experts.intro')}
            </p>
            {hasDiagnostic ? (
              <a
                href={`#${DIAGNOSTIC_ID}`}
                className={button({ variant: 'primary', size: 'md' })}
              >
                {t('experts.cta')}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : null}
          </div>

          <ul
            className={css({
              display: 'grid',
              // The card back needs about 250px (#223).
              gridTemplateColumns: {
                base: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
                xl: 'repeat(2, minmax(0, 1fr))',
              },
              gap: '5',
            })}
          >
            {experts.map((expert) => (
              <li key={expert.slug} className={css({ display: 'flex' })}>
                <PersonCard
                  name={expert.name}
                  role={expert.role}
                  photo={expert.photo}
                  challenge={challenge}
                  challengeLabel={t('experts.label', {
                    name: challengeName,
                    interpolation: { escapeValue: false },
                  })}
                  contribution={expert.contribution ?? undefined}
                  tools={expert.tools}
                  toolLimit={TOOL_LIMIT}
                  previousCompanies={expert.previousCompanies}
                  headingLevel="h3"
                  className={css({ flex: '1' })}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
