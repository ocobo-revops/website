import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';

import { MemberCard } from '~/components/member/member-card';
import type { Member } from '~/modules/content';

interface StoryTeamBlockProps {
  members: Member[];
}

const StoryTeamBlock: React.FunctionComponent<StoryTeamBlockProps> = ({
  members,
}) => {
  const { t } = useTranslation();

  if (members.length === 0) return null;

  return (
    <section
      className={css({
        mt: '16',
        pt: '12',
        borderTopWidth: '1px',
        borderColor: 'gray.100',
      })}
    >
      <h2
        className={css({
          fontSize: 'xs',
          fontWeight: 'black',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'gray.400',
          mb: '6',
        })}
      >
        {t('clients.team.heading')}
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
          gap: '6',
        })}
      >
        {members.map((member) => (
          <MemberCard key={member.slug} member={member} />
        ))}
      </div>
    </section>
  );
};

StoryTeamBlock.displayName = 'StoryTeamBlock';

export { StoryTeamBlock };
