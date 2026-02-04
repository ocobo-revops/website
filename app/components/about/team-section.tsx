import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { css } from '@ocobo/styled-system/css';
import { center, flex, grid } from '@ocobo/styled-system/patterns';
import { button } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';
import { url } from '~/utils/url';

import { Container } from '../ui/Container';
import { TeamMemberCard } from './team-member-card';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  linkedInUrl?: string;
  color: ThemeColor;
};

const IconSeparator = () => {
  return (
    <div
      className={`${center({ gap: { base: '10', md: '20' } })} ${css({
        pt: '16',
        pb: '0',
        bg: 'white',
      })}`}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className={css({ color: 'ocobo.dark' })}
      >
        <title>Decorative illustration</title>
        <circle cx="24" cy="24" r="3.5" fill="currentColor" />
        <line
          x1="24"
          y1="4"
          x2="24"
          y2="44"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="4"
          y1="24"
          x2="44"
          y2="24"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="9.8"
          y1="9.8"
          x2="38.2"
          y2="38.2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="38.2"
          y1="9.8"
          x2="9.8"
          y2="38.2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>

      <svg
        width="84"
        height="84"
        viewBox="0 0 84 84"
        fill="none"
        className={css({ color: 'ocobo.dark' })}
      >
        <title>Decorative illustration</title>
        <circle cx="42" cy="42" r="38" stroke="currentColor" strokeWidth="3" />
        <ellipse cx="32" cy="36" rx="4.5" ry="8" fill="currentColor" />
        <ellipse cx="52" cy="36" rx="4.5" ry="8" fill="currentColor" />
        <path
          d="M26 55 C34 65, 50 65, 58 55"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="24"
          y1="53"
          x2="27"
          y2="56"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="60"
          y1="53"
          x2="57"
          y2="56"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className={css({ color: 'ocobo.dark' })}
      >
        <title>Decorative illustration</title>
        <circle cx="24" cy="24" r="3.5" fill="currentColor" />
        <line
          x1="24"
          y1="4"
          x2="24"
          y2="44"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="4"
          y1="24"
          x2="44"
          y2="24"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="9.8"
          y1="9.8"
          x2="38.2"
          y2="38.2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line
          x1="38.2"
          y1="9.8"
          x2="9.8"
          y2="38.2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
};

type TeamSectionProps = {
  showStudio: boolean;
};

export const TeamSection = ({ showStudio }: TeamSectionProps) => {
  const { t } = useTranslation('about');
  const getLocalizedPath = useLocalizedPathname();
  const members = t('team.members', { returnObjects: true }) as TeamMember[];

  return (
    <>
      <IconSeparator />
      <section className={css({ pt: '12', pb: '24', bg: 'white' })}>
        <Container>
          <div
            className={css({
              textAlign: 'center',
              mb: '16',
              maxW: '3xl',
              mx: 'auto',
            })}
          >
            <h2
              className={css({
                fontFamily: 'display',
                fontSize: '4xl',
                fontWeight: 'bold',
                mb: '6',
              })}
            >
              {t('team.title')}
            </h2>
            <p
              className={css({
                fontSize: 'xl',
                fontWeight: 'medium',
                color: 'ocobo.dark',
                mb: '4',
              })}
            >
              {t('team.subtitle')}
            </p>
            <p className={css({ color: 'gray.600' })}>
              {t('team.description')}
            </p>
          </div>

          <div className={grid({ columns: { base: 1, md: 3 }, gap: '8' })}>
            {members.map((member) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                role={member.role}
                bio={member.bio}
                linkedInUrl={member.linkedInUrl}
                color={member.color}
              />
            ))}
          </div>

          <div
            className={`${flex({ direction: 'column', align: 'center', gap: '8' })} ${css(
              {
                textAlign: 'center',
                mt: '12',
              },
            )}`}
          >
            <p className={css({ fontWeight: 'bold', fontSize: 'xl' })}>
              {t('team.callout.prefix')}{' '}
              <span className={css({ bg: 'ocobo.yellow.light', px: '2' })}>
                {t('team.callout.highlight')}
              </span>
            </p>
            {showStudio ? (
              <NavLink
                to={getLocalizedPath(url.studio)}
                className={button({ variant: 'primary', size: 'lg' })}
              >
                {t('team.cta')}
              </NavLink>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
};
