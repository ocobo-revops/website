import { Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';

export const TeamPhotoIllustration = () => {
  const { t } = useTranslation('studio');

  return (
    <div
      className={css({
        position: 'relative',
        width: 'full',
        maxW: '4xl',
        mx: 'auto',
        py: '12',
        px: '4',
        _hover: {
          '& .corner-accent-tl': { borderColor: 'ocobo.yellow' },
          '& .corner-accent-br': { borderColor: 'ocobo.mint' },
        },
      })}
    >
      {/* Background decorative blobs */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: 0,
            left: '25%',
            width: '16rem',
            height: '16rem',
            bg: 'ocobo.yellow/30',
            rounded: 'full',
            filter: 'blur(48px)',
            animation: 'float-blob',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '18rem',
            height: '18rem',
            bg: 'ocobo.mint/30',
            rounded: 'full',
            filter: 'blur(48px)',
            animation: 'float-blob',
            animationDelay: '-4s',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '50%',
            left: '2.5rem',
            width: '12rem',
            height: '12rem',
            bg: 'ocobo.coral/20',
            rounded: 'full',
            filter: 'blur(48px)',
            animation: 'float-blob',
            animationDelay: '-8s',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '25%',
            right: 0,
            width: '14rem',
            height: '14rem',
            bg: 'ocobo.sky/30',
            rounded: 'full',
            filter: 'blur(48px)',
            animation: 'float-blob',
            animationDelay: '-2s',
          })}
        />
      </div>

      {/* Photo container */}
      <div
        className={`group ${css({ position: 'relative', zIndex: 10, mx: 'auto' })}`}
      >
        {/* Corner accents */}
        <div
          className={`corner-accent-tl ${css({
            position: 'absolute',
            top: '-1.5rem',
            left: '-1.5rem',
            width: '4rem',
            height: '4rem',
            borderTop: '2px solid',
            borderLeft: '2px solid',
            borderColor: 'ocobo.dark/10',
            transition: 'border-color 700ms',
          })}`}
        />
        <div
          className={`corner-accent-br ${css({
            position: 'absolute',
            bottom: '-1.5rem',
            right: '-1.5rem',
            width: '4rem',
            height: '4rem',
            borderBottom: '2px solid',
            borderRight: '2px solid',
            borderColor: 'ocobo.dark/10',
            transition: 'border-color 700ms',
          })}`}
        />

        {/* Main photo card */}
        <div
          className={css({
            position: 'relative',
            bg: 'white',
            p: '2.5',
            rounded: '3xl',
            shadow: 'soft-lg',
            borderWidth: '1px',
            borderColor: 'gray.100',
            overflow: 'hidden',
            transition: 'transform 700ms',
            _hover: { transform: 'scale(1.01)' },
          })}
        >
          <img
            src="/images/studio.jpg"
            alt={t('hero.photoAlt')}
            className={css({
              width: 'full',
              height: 'auto',
              rounded: '3xl',
              filter: 'grayscale(1) contrast(1.1) brightness(1.05)',
              transition: 'all 1000ms ease-in-out',
              _groupHover: { filter: 'grayscale(0)' },
            })}
          />

          {/* Overlay gradient */}
          <div
            className={css({
              position: 'absolute',
              inset: 0,
              bgGradient: 'to-t',
              gradientFrom: 'black/30',
              gradientTo: 'transparent',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 700ms',
              _groupHover: { opacity: 1 },
            })}
          />

          {/* Caption badge */}
          <div
            className={`${hstack({ gap: '3' })} ${css({
              position: 'absolute',
              bottom: '2.5rem',
              left: '2.5rem',
              bg: 'white/90',
              backdropFilter: 'blur(12px)',
              px: '6',
              py: '3.5',
              rounded: '2xl',
              shadow: '2xl',
              transform: 'translateY(1rem)',
              opacity: 0,
              transition: 'all 500ms',
              transitionDelay: '100ms',
              _groupHover: { transform: 'translateY(0)', opacity: 1 },
            })}`}
          >
            <div
              className={css({
                width: '2.5',
                height: '2.5',
                rounded: 'full',
                bg: 'ocobo.mint',
                animation: 'pulse',
              })}
            />
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'black',
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: 'ocobo.dark',
              })}
            >
              {t('hero.captionBadge')}
            </span>
          </div>
        </div>

        {/* Floating icons */}
        <div
          className={css({
            position: 'absolute',
            top: '-3rem',
            right: '3rem',
            p: '5',
            bg: 'white',
            rounded: '2xl',
            shadow: 'xl',
            transform: 'rotate(12deg)',
            animation: 'bounce-slow',
            display: { base: 'none', md: 'flex' },
            borderWidth: '1px',
            borderColor: 'gray.50',
          })}
        >
          <Sparkles className={css({ color: 'ocobo.yellow' })} size={28} />
        </div>
        <div
          className={css({
            position: 'absolute',
            bottom: '-2.5rem',
            left: '6rem',
            p: '5',
            bg: 'ocobo.dark',
            color: 'white',
            rounded: '2xl',
            shadow: 'xl',
            transform: 'rotate(-6deg)',
            animation: 'bounce-slow',
            animationDelay: '1s',
            display: { base: 'none', md: 'flex' },
          })}
        >
          <Users size={24} />
        </div>
      </div>
    </div>
  );
};
