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

const pill = cx(
  text({ variant: 'label' }),
  css({
    alignSelf: 'flex-start',
    px: '3',
    py: '1',
    borderRadius: 'full',
  }),
);
// The whole card is the link target, through the heading link.
const cardLink = css({
  _hover: { textDecoration: 'underline' },
  _after: { content: '""', position: 'absolute', inset: '0' },
});
const faces = css({
  display: 'flex',
  '& > li:not(:first-child)': { ml: '-2.5' },
});

/**
 * One card per published challenge (`#expertises`): the challenge name in a
 * pill of its colour, its promise as the title, then its experts' faces and
 * first names. The whole card links to the challenge page. Hidden when no
 * challenge loaded.
 */
export function ExpertisesSection({ members }: ExpertisesSectionProps) {
  const { t, i18n } = useTranslation('studio');
  const { challenges } = useChallengeMenu();
  const getLocalizedPath = useLocalizedPathname();
  if (challenges.length === 0) return null;

  // "Jeanne et Hugo", "Jeanne, Hugo et Clara" in the page language.
  const names = new Intl.ListFormat(i18n.language, { type: 'conjunction' });

  return (
    <section
      id="expertises"
      className={cx(section({ bg: 'gray' }), css({ scrollMarginTop: '24' }))}
    >
      <Container>
        <div
          className={css({
            maxW: '3xl',
            mx: 'auto',
            mb: '16',
            textAlign: 'center',
          })}
        >
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
                <span className={cx(pill, challengeFill[challenge.key])}>
                  {challenge.name}
                </span>
                <h3 className={text({ variant: 'display-md-black' })}>
                  <Link
                    to={getLocalizedPath(`/challenges/${challenge.slug}`)}
                    className={cardLink}
                  >
                    {challenge.tagline ?? challenge.name}
                  </Link>
                </h3>
                {experts.length > 0 && (
                  <div
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3.5',
                      mt: 'auto',
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
                    <p
                      className={cx(
                        text({ variant: 'small', color: 'muted' }),
                        css({ fontWeight: 'semibold' }),
                      )}
                    >
                      {names.format(
                        experts.map((expert) => getFirstName(expert.name)),
                      )}
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
