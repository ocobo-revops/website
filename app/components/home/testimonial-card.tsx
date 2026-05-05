import { ArrowRight } from 'lucide-react';
import type React from 'react';
import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { center, flex } from '@ocobo/styled-system/patterns';
import { text } from '@ocobo/styled-system/recipes';

import { useLocalizedPathname } from '~/hooks/useLocalizedPathname';

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  authorInitials?: string;
  authorAvatar?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorRole,
  authorInitials,
  authorAvatar,
  ctaText,
  ctaLink,
  className = '',
}) => {
  const getLocalizedPath = useLocalizedPathname();
  const initials =
    authorInitials ||
    authorName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();

  return (
    <div
      className={`${css({
        position: 'relative',
        py: '16',
        px: { base: '8', md: '16' },
        bg: 'white/5',
        rounded: '3xl',
        borderWidth: '1px',
        borderColor: 'white/10',
        shadow: '2xl',
        overflow: 'hidden',
        backdropFilter: 'blur(4px)',
      })} group ${className}`}
    >
      <div
        className={css({
          position: 'absolute',
          top: '8',
          left: '8',
          color: 'ocobo.yellow/15',
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'transform',
          transitionDuration: '1000ms',
          _groupHover: { transform: 'scale(1.1)' },
        })}
      >
        <svg width="140" height="110" viewBox="0 0 140 110" fill="currentColor">
          <path d="M35 110C15.6667 110 0 94.3333 0 75C0 55.6667 15.6667 40 35 40V0L70 40V75C70 94.3333 54.3333 110 35 110ZM105 110C85.6667 110 70 94.3333 70 75C70 55.6667 85.6667 40 105 40V0L140 40V75C140 94.3333 124.333 110 105 110Z" />
        </svg>
      </div>

      <div className={css({ position: 'relative', zIndex: '10' })}>
        <p
          className={cx(
            text({ variant: 'display-md', color: 'white' }),
            css({
              fontSize: { base: 'lg', md: '2xl' },
              mb: '12',
              lineHeight: 'relaxed',
              maxW: '2xl',
              mx: { base: 'auto', md: '0' },
            }),
          )}
        >
          {quote}
        </p>

        <div
          className={css({
            w: 'full',
            h: '1',
            bgGradient: 'to-r',
            gradientFrom: 'ocobo.yellow',
            gradientVia: 'ocobo.coral',
            gradientTo: 'ocobo.sky',
            opacity: '0.4',
            mb: '10',
          })}
        />

        <div
          className={flex({
            direction: { base: 'column', md: 'row' },
            align: { md: 'center' },
            justify: 'space-between',
            gap: '8',
          })}
        >
          <div className={flex({ align: 'center', gap: '6' })}>
            <div
              className={cx(
                text({ variant: 'display-md', color: 'dark' }),
                center({
                  w: '14',
                  h: '14',
                  bg: 'ocobo.yellow',
                  rounded: '2xl',
                  color: 'ocobo.dark',
                  fontSize: 'xl',
                  shadow: 'xl',
                  overflow: 'hidden',
                  transform: 'rotate(3deg)',
                  transition: 'transform',
                  transitionDuration: '500ms',
                  _groupHover: { transform: 'rotate(0deg)' },
                }),
              )}
            >
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className={css({
                    w: 'full',
                    h: 'full',
                    objectFit: 'cover',
                  })}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) {
                      (
                        e.currentTarget.nextSibling as HTMLElement
                      ).style.display = '';
                    }
                  }}
                />
              ) : null}
              <span style={authorAvatar ? { display: 'none' } : undefined}>
                {initials}
              </span>
            </div>
            <div
              className={flex({
                direction: 'column',
                align: 'flex-start',
                gap: '1',
              })}
            >
              <p
                className={cx(
                  text({ variant: 'display-md', color: 'white' }),
                  css({
                    fontSize: 'lg',
                    letterSpacing: 'tight',
                  }),
                )}
              >
                {authorName}
              </p>
              <p
                className={cx(
                  text({ variant: 'label', color: 'yellow' }),
                  css({ mt: '0' }),
                )}
              >
                {authorRole}
              </p>
            </div>
          </div>

          {ctaText && ctaLink && (
            <NavLink
              to={getLocalizedPath(ctaLink)}
              className={cx(
                text({ variant: 'label', color: 'white' }),
                flex({
                  align: 'center',
                  gap: '4',
                  transition: 'colors',
                  transitionDuration: '300ms',
                  _hover: { color: 'ocobo.yellow' },
                }),
                css({ color: 'white/40' }),
                'group/btn',
              )}
            >
              {ctaText}
              <ArrowRight
                size={14}
                className={css({
                  transition: 'transform',
                  transitionDuration: '300ms',
                  _groupHover: { transform: 'translateX(8px)' },
                })}
              />
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};
