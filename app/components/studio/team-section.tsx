import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { section, text } from '@ocobo/styled-system/recipes';

import { PersonCard } from '~/components/member/person-card';
import { Container } from '~/components/ui/Container';
import { useChallengeMenu } from '~/hooks/use-challenge-menu';
import type { StudioMemberCard } from '~/modules/studio-team';

type TeamSectionProps = {
  members: StudioMemberCard[];
};

/**
 * Every active Team member as a `PersonCard`, with all their tools (#244).
 * A member without expert fields gets a card without those lines, and the
 * bio on the back.
 */
export function TeamSection({ members }: TeamSectionProps) {
  const { t } = useTranslation(['studio', 'challenges']);
  const { challenges } = useChallengeMenu();
  const challengeName = new Map(
    challenges.map((challenge) => [challenge.key, challenge.name]),
  );

  return (
    <section
      id="equipe"
      className={cx(section({ bg: 'white' }), css({ scrollMarginTop: '24' }))}
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
            {t('team.title')}
          </h2>
          <p className={text({ variant: 'body', color: 'muted' })}>
            {t('team.subtitle')}
          </p>
        </div>

        <ul
          className={css({
            display: 'grid',
            // The card back needs about 250px (#223).
            gridTemplateColumns: {
              base: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))',
            },
            gap: '5',
          })}
        >
          {members.map((member) => {
            const name = member.challenge
              ? challengeName.get(member.challenge)
              : undefined;
            return (
              <li key={member.slug} className={css({ display: 'flex' })}>
                <PersonCard
                  name={member.name}
                  role={member.role}
                  photo={member.photo || undefined}
                  challenge={member.challenge ?? undefined}
                  challengeLabel={
                    name
                      ? t('challenges:experts.label', {
                          name,
                          interpolation: { escapeValue: false },
                        })
                      : undefined
                  }
                  contribution={member.contribution ?? undefined}
                  // Without a contribution, the bio fills the back.
                  bio={member.bio ?? undefined}
                  showBio={!member.contribution}
                  tools={member.tools}
                  previousCompanies={member.previousCompanies}
                  headingLevel="h3"
                  className={css({ flex: '1' })}
                />
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
