import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { flex, grid } from '@ocobo/styled-system/patterns';

import { Container } from '../ui/Container';
import { TeamMemberCard } from './team-member-card';

const CATEGORIES = [
  'TOUS',
  'Architecte',
  'Builder',
  'Expert Engineer',
] as const;

type Category = (typeof CATEGORIES)[number];

interface TeamMember {
  name: string;
  category: string;
  role: string;
  desc: string;
  img: string;
  hoverBg: string;
  hoverText: string;
  linkedin?: string;
}

export const TeamSection = () => {
  const { t } = useTranslation('studio');
  const [filter, setFilter] = useState<Category>('TOUS');
  const [animate, setAnimate] = useState(false);

  const members = t('team.members', { returnObjects: true }) as TeamMember[];
  const filters = t('team.filters', {
    returnObjects: true,
  }) as Record<string, string>;

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [filter]);

  const filtered =
    filter === 'TOUS' ? members : members.filter((m) => m.category === filter);

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
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setFilter(cat)}
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
                  bg: filter === cat ? 'ocobo.dark' : 'gray.50',
                  color: filter === cat ? 'white' : 'gray.500',
                  borderColor: filter === cat ? 'ocobo.dark' : 'gray.100',
                  shadow: filter === cat ? 'lg' : 'none',
                  _hover: filter !== cat ? { borderColor: 'ocobo.dark' } : {},
                })}
              >
                {filters[cat] ?? cat}
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
              key={`${member.name}-${filter}`}
              {...member}
              animate={animate}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
