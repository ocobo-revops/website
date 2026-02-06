import { Linkedin } from 'lucide-react';

import { css, cx } from '@ocobo/styled-system/css';
import { center } from '@ocobo/styled-system/patterns';

interface TeamMemberCardProps {
  name: string;
  category: string;
  role: string;
  desc: string;
  img: string;
  hoverBg: string;
  hoverText: string;
  linkedin?: string;
  animate: boolean;
}

export const TeamMemberCard = ({
  name,
  category,
  role,
  desc,
  img,
  animate,
  linkedin,
}: TeamMemberCardProps) => {
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
      {/* Left colour bar */}
      <div
        className={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1.5',
          height: 'full',
          bg: 'gray.50',
          transition: 'all 300ms',
        })}
      />

      {/* Category badge */}
      <div
        className={css({
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
          bg: 'gray.100',
          color: 'gray.400',
          transition: 'all 300ms',
        })}
      >
        {category}
      </div>

      {/* Photo */}
      <div
        className={css({
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
          _groupHover: { borderColor: 'ocobo.dark' },
        })}
      >
        <img
          src={img}
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
          {desc}
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
