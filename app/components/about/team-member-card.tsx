import { Linkedin } from 'lucide-react';
import type React from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { card, text } from '@ocobo/styled-system/recipes';

import { OptimizedImage } from '../ui/optimized-image';

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

const avatarBorderStyles: Record<ThemeColor, string> = {
  yellow: css({ borderColor: 'ocobo.yellow' }),
  mint: css({ borderColor: 'ocobo.mint' }),
  sky: css({ borderColor: 'ocobo.sky' }),
  coral: css({ borderColor: 'ocobo.coral' }),
  dark: css({ borderColor: 'ocobo.dark' }),
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
      className={cx(
        card({ padding: 'lg', border: true }),
        css({
          transition: 'all',
          textAlign: 'center',
          _hover: { shadow: 'lg' },
        }),
        className,
      )}
    >
      <div
        className={cx(
          css({
            w: '32',
            h: '32',
            mx: 'auto',
            mb: '6',
            rounded: 'full',
            overflow: 'hidden',
            borderWidth: '4px',
          }),
          avatarBorderStyles[color],
        )}
      >
        <OptimizedImage
          src={imageSrc}
          alt={name}
          width={128}
          height={128}
          className={css({ w: 'full', h: 'full', objectFit: 'cover' })}
        />
      </div>
      <h3
        className={cx(
          text({ variant: 'display-md-bold', color: 'dark' }),
          css({ mb: '1' }),
        )}
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
