import { Linkedin } from 'lucide-react';
import type React from 'react';

import { css } from '@ocobo/styled-system/css';

type ThemeColor = 'yellow' | 'mint' | 'sky' | 'coral' | 'dark';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  imageSrc?: string;
  linkedInUrl?: string;
  color?: ThemeColor;
  className?: string;
}

const borderColorMap: Record<ThemeColor, string> = {
  yellow: 'ocobo.yellow',
  mint: 'ocobo.mint',
  sky: 'ocobo.sky',
  coral: 'ocobo.coral',
  dark: 'ocobo.dark',
};

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  bio,
  imageSrc = 'https://placehold.co/200x200/F3F4F6/F3F4F6',
  linkedInUrl,
  color = 'yellow',
  className = '',
}) => {
  return (
    <div
      className={`${css({
        bg: 'white',
        p: '8',
        borderWidth: '1px',
        borderColor: 'gray.100',
        shadow: 'sm',
        transition: 'all',
        textAlign: 'center',
        _hover: { shadow: 'lg' },
      })} ${className}`}
    >
      <div
        className={css({
          w: '32',
          h: '32',
          mx: 'auto',
          mb: '6',
          rounded: 'full',
          overflow: 'hidden',
          borderWidth: '4px',
          borderColor: borderColorMap[color],
        })}
      >
        <img
          src={imageSrc}
          alt={name}
          className={css({ w: 'full', h: 'full', objectFit: 'cover' })}
        />
      </div>
      <h3
        className={css({
          fontFamily: 'display',
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'ocobo.dark',
          mb: '1',
        })}
      >
        {name}
      </h3>
      <p
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          color: 'gray.400',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          mb: '4',
        })}
      >
        {role}
      </p>
      <p
        className={css({
          color: 'gray.600',
          fontSize: 'sm',
          mb: '6',
          lineHeight: 'relaxed',
        })}
      >
        {bio}
      </p>
      {linkedInUrl ? (
        <a
          href={linkedInUrl}
          className={css({
            display: 'inline-block',
            color: 'gray.400',
            _hover: { color: 'ocobo.dark' },
          })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} LinkedIn profile`}
        >
          <Linkedin size={20} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
};
