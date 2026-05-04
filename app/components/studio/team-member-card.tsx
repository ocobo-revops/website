import { Linkedin } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

import type { MemberTrack } from '~/modules/schemas';

type TrackColor = 'yellow' | 'coral' | 'mint';

const trackColorMap: Record<MemberTrack, TrackColor> = {
  architect: 'yellow',
  builder: 'coral',
  'expert-engineer': 'mint',
};

const badgeBgStyles: Record<TrackColor, string> = {
  yellow: css({ bg: 'ocobo.yellow.light', color: 'ocobo.yellow' }),
  coral: css({ bg: 'ocobo.coral.light', color: 'ocobo.coral' }),
  mint: css({ bg: 'ocobo.mint.light', color: 'ocobo.mint' }),
};

const photoBorderStyles: Record<TrackColor, string> = {
  yellow: css({ _groupHover: { borderColor: 'ocobo.yellow' } }),
  coral: css({ _groupHover: { borderColor: 'ocobo.coral' } }),
  mint: css({ _groupHover: { borderColor: 'ocobo.mint' } }),
};

interface TeamMemberCardProps {
  name: string;
  track: MemberTrack;
  trackLabel: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  animate: boolean;
}

export const TeamMemberCard = ({
  name,
  track,
  trackLabel,
  role,
  bio,
  avatar,
  animate,
  linkedin,
}: TeamMemberCardProps) => {
  const color = trackColorMap[track];

  return (
    <div
      className={cx(
        'group',
        css({
          bg: 'white',
          borderWidth: '1px',
          borderColor: 'gray.100',
          p: '8',
          position: 'relative',
          overflow: 'hidden',
          rounded: 'xl',
          transition: 'all 300ms',
          _hover: { shadow: 'xl', transform: 'translateY(-4px)' },
        }),
        animate
          ? css({ opacity: 0, animation: 'fade-in-up-small' })
          : css({ opacity: 0 }),
      )}
    >
      {/* Track badge */}
      <div
        className={cx(
          css({
            position: 'absolute',
            top: 0,
            right: 0,
            px: '4',
            py: '1.5',
            roundedBottomLeft: 'xl',
            fontFamily: 'display',
            fontWeight: 'black',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'widest',
            shadow: 'sm',
            transition: 'all 300ms',
          }),
          badgeBgStyles[color],
        )}
      >
        {trackLabel}
      </div>

      {/* Photo */}
      <div
        className={cx(
          css({
            width: '32',
            height: '32',
            mx: 'auto',
            mb: '6',
            rounded: 'full',
            overflow: 'hidden',
            borderWidth: '4px',
            borderColor: 'gray.50',
            transition: 'all 500ms',
            shadow: 'sm',
            bg: 'gray.50',
          }),
          photoBorderStyles[color],
        )}
      >
        <img
          src={avatar}
          alt={name}
          className={css({
            width: 'full',
            height: 'full',
            objectFit: 'cover',
            filter: 'grayscale(1)',
            transition: 'all 500ms',
            _groupHover: { filter: 'grayscale(0)' },
          })}
        />
      </div>

      {/* Info */}
      <div className={css({ textAlign: 'center' })}>
        <h3
          className={css({
            fontFamily: 'display',
            fontSize: 'xl',
            fontWeight: 'black',
            color: 'ocobo.dark',
            mb: '1',
          })}
        >
          {name}
        </h3>
        <p
          className={`${center()} ${css({
            fontSize: 'xs',
            fontWeight: 'black',
            color: 'gray.400',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            mb: '4',
            height: '6',
          })}`}
        >
          {role}
        </p>

        <p
          className={css({
            color: 'gray.500',
            fontSize: 'sm',
            mb: '6',
            lineHeight: 'relaxed',
            minH: '4rem',
            fontWeight: 'medium',
          })}
        >
          {bio}
        </p>

        {linkedin ? (
          <div
            className={`${center()} ${css({
              pt: '4',
              borderTop: '1px solid',
              borderColor: 'gray.50',
            })}`}
          >
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} LinkedIn`}
              className={css({
                color: 'gray.300',
                transition: 'color 200ms',
                _hover: { color: 'ocobo.dark' },
              })}
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};
