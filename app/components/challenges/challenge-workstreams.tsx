import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { Container } from '~/components/ui/Container';
import { FlipCard } from '~/components/ui/flip-card';
import type {
  ChallengeWorkstream,
  ChallengeWorkstreams as ChallengeWorkstreamsData,
} from '~/modules/challenge-page';
import type { ChallengeKey } from '~/modules/challenge-schema';

/** Target of the hero's secondary CTA. */
export const WORKSTREAMS_ID = 'chantiers';

// The page root sets `colorPalette` to the challenge colour (route file).
// Revenue AI's back takes the AI gradient, as in the mockup.
const backStyles = {
  default: css({ bg: 'colorPalette', color: 'dark' }),
  ai: css({ bgGradient: 'ai', color: 'dark' }),
};

// Back texts use `dark/80`: above 5:1 on every challenge colour.
const backDivider = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'dark/15',
});

// The mockup's 36px, with a shorter bottom so long texts still fit.
const facePadding = css({
  px: { base: '7', md: '9' },
  pt: { base: '7', md: '9' },
  pb: '7',
});

type ChallengeWorkstreamsProps = {
  workstreams: ChallengeWorkstreamsData;
  challenge: ChallengeKey;
  /** The locale heading, used when the file has no override. */
  defaultTitle: string;
};

export function ChallengeWorkstreams({
  workstreams,
  challenge,
  defaultTitle,
}: ChallengeWorkstreamsProps) {
  const backClassName = challenge === 'ai' ? backStyles.ai : backStyles.default;

  return (
    <section id={WORKSTREAMS_ID} className={section({ bg: 'white' })}>
      <Container>
        <div
          className={css({
            maxW: '2xl',
            mx: 'auto',
            mb: { base: '12', md: '20' },
            textAlign: 'center',
          })}
        >
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '4' }))}>
            {workstreams.title ?? defaultTitle}
          </h2>
          {workstreams.intro ? (
            <p className={text({ variant: 'body', color: 'muted' })}>
              {workstreams.intro}
            </p>
          ) : null}
        </div>
        <ul
          // `list-style: none` drops list semantics in Safari.
          role="list"
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: { base: '6', md: '10' },
          })}
        >
          {workstreams.items.map((item, index) => (
            // Titles can repeat in a draft: the position keeps keys unique.
            <li key={index}>
              <WorkstreamCard item={item} backClassName={backClassName} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

type WorkstreamCardProps = {
  item: ChallengeWorkstream;
  backClassName: string;
};

function WorkstreamCard({ item, backClassName }: WorkstreamCardProps) {
  const { t } = useTranslation('challenges');
  const label = [
    item.category,
    item.step === null ? null : t('workstreams.step', { step: item.step }),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <FlipCard
      label={item.title}
      // The mockup's 380px in three columns; taller below, where the
      // narrower faces wrap the text onto more lines.
      className={css({ h: { base: 'md', xl: 'sm' } })}
      frontClassName={facePadding}
      backClassName={cx(backClassName, facePadding)}
      front={
        <>
          {label ? (
            <p
              className={cx(
                text({ variant: 'label', color: 'muted' }),
                // Clears the flip button in the top corner.
                css({ mb: '3', pr: '12' }),
              )}
            >
              {label}
            </p>
          ) : null}
          <h3
            className={cx(
              text({ variant: 'display-md-bold' }),
              css({ mb: '2.5' }),
              // Clears the flip button when no label sits above.
              label ? null : css({ pr: '12' }),
            )}
          >
            {item.title}
          </h3>
          {item.description ? (
            <p className={text({ variant: 'body', color: 'muted' })}>
              {item.description}
            </p>
          ) : null}
          <p
            // The flip button already names the action for screen readers.
            aria-hidden="true"
            className={cx(
              text({ variant: 'label', color: 'muted' }),
              css({
                mt: 'auto',
                pt: '3.5',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'line',
              }),
            )}
          >
            {t('workstreams.delivered')}
          </p>
        </>
      }
      back={
        <>
          {label ? (
            <p
              className={cx(
                text({ variant: 'label' }),
                css({ pr: '12', color: 'dark/80' }),
              )}
            >
              {label}
            </p>
          ) : null}
          <span
            aria-hidden="true"
            className={css({
              mt: 'auto',
              mb: '4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: '0',
              w: '11',
              h: '11',
              rounded: 'lg',
              bg: 'white/35',
            })}
          >
            <Check size={18} strokeWidth={2.2} />
          </span>
          <p
            className={cx(
              text({ variant: 'label' }),
              css({ mb: '2.5', color: 'dark/80' }),
            )}
          >
            {t('workstreams.delivered')}
          </p>
          <p
            className={cx(
              text({ variant: 'body' }),
              css({ fontWeight: 'bold', lineHeight: 'snug' }),
            )}
          >
            {item.deliverable}
          </p>
          <p
            // Without a note the mockup repeats the title: read it once.
            aria-hidden={item.note ? undefined : true}
            className={cx(
              text({ variant: 'small' }),
              backDivider,
              css({ mt: '5', pt: '4', color: 'dark/80' }),
            )}
          >
            {item.note ?? item.title}
          </p>
        </>
      }
    />
  );
}
