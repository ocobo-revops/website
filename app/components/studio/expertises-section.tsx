import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { card, section, text } from '@ocobo/styled-system/recipes';

import { challengeFill } from '~/components/challenges/challenge-palette';
import { MemberAvatar } from '~/components/member/member-avatar';
import { Container } from '~/components/ui/Container';
import { useChallengeMenu } from '~/hooks/use-challenge-menu';
import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import type { StudioMemberCard } from '~/modules/studio-team';
import { getFirstName } from '~/utils/first-name';

type ExpertisesSectionProps = {
  members: StudioMemberCard[];
};

const bar = css({ w: '10', h: '1.5', borderRadius: 'full' });
// The whole card is the link target, through the heading link.
const cardLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  _hover: { textDecoration: 'underline' },
  _after: { content: '""', position: 'absolute', inset: '0' },
});
const faces = css({
  display: 'flex',
  '& > li:not(:first-child)': { ml: '-2' },
});

/**
 * One card per published challenge, with the faces of its experts and a link
 * to the challenge page (`#expertises`). Hidden when no challenge loaded.
 */
export function ExpertisesSection({ members }: ExpertisesSectionProps) {
  const { t } = useTranslation('studio');
  const { challenges } = useChallengeMenu();
  const getLocalizedPath = useLocalizedPathname();
  if (challenges.length === 0) return null;

  return (
    <section
      id="expertises"
      className={cx(section({ bg: 'gray' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div className={css({ maxW: '3xl', mb: '14' })}>
          <h2 className={cx(text({ variant: 'display-lg' }), css({ mb: '5' }))}>
            {t('expertises.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('expertises.subtitle')}
          </p>
        </div>

        <ul
          className={css({
            display: 'grid',
            gridTemplateColumns: {
              base: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: '6',
          })}
        >
          {challenges.map((challenge) => {
            const experts = members.filter(
              (member) => member.challenge === challenge.key,
            );
            return (
              <li
                key={challenge.slug}
                className={cx(card(), css({ position: 'relative', gap: '4' }))}
              >
                <span
                  aria-hidden="true"
                  className={cx(bar, challengeFill[challenge.key])}
                />
                <h3 className={text({ variant: 'display-md-black' })}>
                  <Link
                    to={getLocalizedPath(`/challenges/${challenge.slug}`)}
                    className={cardLink}
                  >
                    {challenge.name}
                    <ArrowRight size={20} aria-hidden="true" />
                  </Link>
                </h3>
                {challenge.tagline && (
                  <p className={text({ variant: 'body', color: 'muted' })}>
                    {challenge.tagline}
                  </p>
                )}
                {experts.length > 0 && (
                  <div
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3',
                    })}
                  >
                    <ul aria-hidden="true" className={faces}>
                      {experts.map((expert) => (
                        <li key={expert.slug}>
                          <MemberAvatar
                            name={expert.name}
                            photo={expert.photo}
                            challenge={expert.challenge}
                            size="sm"
                          />
                        </li>
                      ))}
                    </ul>
                    <p className={text({ variant: 'small', color: 'muted' })}>
                      {t('expertises.experts', {
                        names: experts
                          .map((expert) => getFirstName(expert.name))
                          .join(', '),
                        interpolation: { escapeValue: false },
                      })}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
