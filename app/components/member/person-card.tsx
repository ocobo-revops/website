import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { challengeFill } from '~/components/challenges/challenge-palette';
import { FlipCard } from '~/components/ui/flip-card';
import { getFirstName } from '~/utils/first-name';

import { MemberAvatar } from './member-avatar';

/** Challenge keys, as in the posts frontmatter and the `challenge` tokens. */
export type ChallengeKey = 'rp' | 'se' | 'sc' | 'cx' | 'sy' | 'ai';

type PersonCardProps = {
  name: string;
  role: string;
  /** Photo URL. Without it, or when it fails to load, initials show. */
  photo?: string;
  /** Colours the photo ring, the label and the back. */
  challenge?: ChallengeKey;
  /** Challenge label under the role, such as "Expert Customer Experience". */
  challengeLabel?: string;
  contribution?: string;
  bio?: string;
  /** Shows `bio` in place of `contribution` (about-us). */
  showBio?: boolean;
  /** Tool names, in the member's order. */
  tools?: readonly string[];
  /** Shows the first `toolLimit` tools only (four on challenge pages). */
  toolLimit?: number;
  previousCompanies?: readonly string[];
  /** Hides the previous companies line (about-us). */
  hidePreviousCompanies?: boolean;
  /** Level of the name heading, to follow the page outline. */
  headingLevel?: 'h2' | 'h3' | 'h4';
  className?: string;
};

const identity = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
});
const roleStyle = cx(text({ variant: 'small' }), css({ color: 'gray' }));
const nameStyle = text({ variant: 'display-md-bold' });
const pill = cx(
  text({ variant: 'label' }),
  css({
    px: '2.5',
    py: '1',
    borderRadius: 'full',
    letterSpacing: 'chip',
  }),
);
const pillGrey = css({ bg: 'gray.100' });
// Back text takes the face colour: white on the Revenue Systems grey.
const inheritColour = css({ color: 'current' });
// Keeps the first name clear of the flip button in the corner.
const firstNameStyle = cx(
  text({ variant: 'display-md-bold' }),
  inheritColour,
  css({ pr: '12' }),
);
const key = cx(
  text({ variant: 'label' }),
  inheritColour,
  css({ letterSpacing: 'tag' }),
);
const detail = cx(text({ variant: 'small' }), inheritColour, css({ mb: '1' }));
const toolList = cx(
  text({ variant: 'small' }),
  inheritColour,
  css({
    display: 'flex',
    flexWrap: 'wrap',
    '& > li:not(:last-child)::after': { content: '", "', whiteSpace: 'pre' },
  }),
);
const footer = cx(
  text({ variant: 'small' }),
  inheritColour,
  css({ mt: 'auto', fontWeight: 'bold' }),
);

/**
 * Person variant of `FlipCard` (ADR 0002), for the team, challenge and
 * about-us pages. Front: photo, name, role and challenge label. Back: first
 * name, contribution (or bio), tools and previous companies. A field that is
 * absent or empty hides its line.
 */
export function PersonCard({
  name,
  role,
  photo,
  challenge,
  challengeLabel,
  contribution,
  bio,
  showBio = false,
  tools = [],
  toolLimit,
  previousCompanies = [],
  hidePreviousCompanies = false,
  headingLevel: Heading = 'h3',
  className,
}: PersonCardProps) {
  const { t } = useTranslation();
  const toolsId = React.useId();
  const summaryId = React.useId();
  const firstName = getFirstName(name);
  const summary = showBio ? bio : contribution;
  const visibleTools =
    toolLimit === undefined ? tools : tools.slice(0, Math.max(0, toolLimit));
  const companies = hidePreviousCompanies ? [] : previousCompanies;

  return (
    <FlipCard
      variant="person"
      label={name}
      className={className}
      backClassName={challenge ? challengeFill[challenge] : undefined}
      front={
        <>
          <MemberAvatar name={name} photo={photo} challenge={challenge} />
          <div className={identity}>
            <Heading className={nameStyle}>{name}</Heading>
            <p className={roleStyle}>{role}</p>
          </div>
          {challengeLabel && (
            <span
              className={cx(
                pill,
                challenge ? challengeFill[challenge] : pillGrey,
              )}
            >
              {challengeLabel}
            </span>
          )}
        </>
      }
      back={
        <>
          <span className={firstNameStyle}>{firstName}</span>
          {summary && (
            <>
              <span id={summaryId} className={key}>
                {t(showBio ? 'personCard.bio' : 'personCard.contribution')}
              </span>
              <p aria-labelledby={summaryId} className={detail}>
                {summary}
              </p>
            </>
          )}
          {visibleTools.length > 0 && (
            <>
              <span id={toolsId} className={key}>
                {t('personCard.tools')}
              </span>
              <ul aria-labelledby={toolsId} className={toolList}>
                {visibleTools.map((tool, index) => (
                  <li key={`${index}-${tool}`}>{tool}</li>
                ))}
              </ul>
            </>
          )}
          {companies.length > 0 && (
            <p className={footer}>
              {t('personCard.previousCompanies', {
                companies: companies.join(', '),
                // React escapes text; i18next escaping would show `&#39;`.
                interpolation: { escapeValue: false },
              })}
            </p>
          )}
        </>
      }
    />
  );
}
