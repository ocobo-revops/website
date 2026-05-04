import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';

import type { StudioMember } from '~/modules/content/members';
import { type MemberTrack, MemberTrackSchema } from '~/modules/schemas';

import { Container } from '../ui/Container';
import { TeamMemberCard } from './team-member-card';

type Filter = MemberTrack | 'all';

const FILTERS = [
  'all',
  ...MemberTrackSchema.options,
] as const satisfies readonly Filter[];

const TRACK_LABEL_FALLBACKS: Record<MemberTrack, string> = {
  architect: 'Architect',
  builder: 'Builder',
  'expert-engineer': 'Expert Engineer',
};

interface TeamSectionProps {
  members: StudioMember[];
}

export const TeamSection = ({ members }: TeamSectionProps) => {
  const { t } = useTranslation('studio');
  const [filter, setFilter] = useState<Filter>('all');
  const [animate, setAnimate] = useState(false);

  const filters = t('team.filters', { returnObjects: true }) as Record<
    string,
    string
  >;

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [filter]);

  const filtered =
    filter === 'all' ? members : members.filter((m) => m.track === filter);

  return (
    <section className={css({ py: '24', bg: 'white' })}>
      <Container>
        <div
          className={`${flex({
            direction: { base: 'column', md: 'row' },
            justify: 'space-between',
            align: 'end',
            gap: '8',
          })} ${css({ mb: '16' })}`}
        >
          <div>
            <h2
              className={css({
                fontFamily: 'display',
                fontSize: '4xl',
                fontWeight: 'black',
                mb: '4',
                color: 'ocobo.dark',
                letterSpacing: 'tight',
              })}
            >
              {t('team.title')}
            </h2>
            <p className={css({ color: 'gray.500', fontWeight: 'medium' })}>
              {t('team.subtitle')}
            </p>
          </div>

          <div className={flex({ wrap: 'wrap', gap: '2' })}>
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={css({
                  px: '6',
                  py: '2.5',
                  rounded: 'full',
                  fontSize: 'xs',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: 'widest',
                  transition: 'all',
                  borderWidth: '1px',
                  cursor: 'pointer',
                  bg: filter === f ? 'ocobo.dark' : 'gray.50',
                  color: filter === f ? 'white' : 'gray.500',
                  borderColor: filter === f ? 'ocobo.dark' : 'gray.100',
                  shadow: filter === f ? 'lg' : 'none',
                  _hover: filter !== f ? { borderColor: 'ocobo.dark' } : {},
                })}
              >
                {f === 'all'
                  ? (filters[f] ?? f)
                  : (filters[f] ?? TRACK_LABEL_FALLBACKS[f])}
              </button>
            ))}
          </div>
        </div>

        <div
          className={grid({
            columns: { base: 1, md: 2, lg: 3 },
            gap: '8',
          })}
        >
          {filtered.map((member) => (
            <TeamMemberCard
              key={`${member.slug}-${filter}`}
              name={member.name}
              track={member.track}
              trackLabel={
                filters[member.track] ?? TRACK_LABEL_FALLBACKS[member.track]
              }
              role={member.role}
              bio={member.bio}
              avatar={member.avatar}
              linkedin={member.linkedin}
              animate={animate}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
