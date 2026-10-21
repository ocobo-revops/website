import { Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css } from '@ocobo/styled-system/css';
import { hstack } from '@ocobo/styled-system/patterns';
import { card, text } from '@ocobo/styled-system/recipes';

import { OptimizedImage } from '~/components/ui/optimized-image';

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
          inset: '0',
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
        })}
      >
        <div
          className={css({
            position: 'absolute',
            top: '0',
            left: '[25%]',
            width: '64',
            height: '64',
            bg: 'ocobo.yellow/30',
            rounded: 'full',
            filter: 'auto',
            blur: '2xl',
            animation: 'float-blob',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            bottom: '[25%]',
            right: '[25%]',
            width: '72',
            height: '72',
            bg: 'ocobo.mint/30',
            rounded: 'full',
            filter: 'auto',
            blur: '2xl',
            animation: 'float-blob',
            animationDelay: '[-4s]',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '[50%]',
            left: '10',
            width: '48',
            height: '48',
            bg: 'ocobo.coral/20',
            rounded: 'full',
            filter: 'auto',
            blur: '2xl',
            animation: 'float-blob',
            animationDelay: '[-8s]',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            top: '[25%]',
            right: '0',
            width: '56',
            height: '56',
            bg: 'ocobo.sky/30',
            rounded: 'full',
            filter: 'auto',
            blur: '2xl',
            animation: 'float-blob',
            animationDelay: '[-2s]',
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
            top: '-6',
            left: '-6',
            width: '16',
            height: '16',
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderLeftWidth: '2px',
            borderLeftStyle: 'solid',
            borderColor: 'ocobo.dark/10',
            transition: 'colors',
            transitionDuration: '[700ms]',
          })}`}
        />
        <div
          className={`corner-accent-br ${css({
            position: 'absolute',
            bottom: '-6',
            right: '-6',
            width: '16',
            height: '16',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderRightWidth: '2px',
            borderRightStyle: 'solid',
            borderColor: 'ocobo.dark/10',
            transition: 'colors',
            transitionDuration: '[700ms]',
          })}`}
        />

        {/* Main photo card */}
        <div
          className={`${card({ radius: 'lg', tone: 'white', border: true })} ${css(
            {
              position: 'relative',
              p: '2.5',
              shadow: 'soft-lg',
              overflow: 'hidden',
              transition: 'transform',
              transitionDuration: '[700ms]',
              _hover: { transform: 'scale(1.01)' },
            },
          )}`}
        >
          <OptimizedImage
            src="/images/studio.jpg"
            alt={t('hero.photoAlt')}
            width={4032}
            height={3024}
            priority
            className={css({
              width: 'full',
              height: 'auto',
              rounded: '3xl',
              filter: 'auto',
              grayscale: '1',
              contrast: '1.1',
              brightness: '1.05',
              transition: 'all',
              transitionDuration: '[1000ms]',
              transitionTimingFunction: 'in-out',
              _groupHover: { filter: 'auto', grayscale: '0' },
            })}
          />

          {/* Overlay gradient */}
          <div
            className={css({
              position: 'absolute',
              inset: '0',
              bgGradient: 'to-t',
              gradientFrom: 'black/30',
              gradientTo: 'transparent',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity',
              transitionDuration: '[700ms]',
              _groupHover: { opacity: 1 },
            })}
          />

          {/* Caption badge */}
          <div
            className={`${hstack({ gap: '3' })} ${css({
              position: 'absolute',
              bottom: '10',
              left: '10',
              bg: 'white/90',
              backdropFilter: 'auto',
              backdropBlur: 'md',
              px: '6',
              py: '3.5',
              rounded: '2xl',
              shadow: '2xl',
              transform: 'translateY(1rem)',
              opacity: 0,
              transition: 'all',
              transitionDuration: 'slowest',
              transitionDelay: 'faster',
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
              className={`${text({ variant: 'display-label', color: 'dark' })}`}
            >
              {t('hero.captionBadge')}
            </span>
          </div>
        </div>

        {/* Floating icons */}
        <div
          className={css({
            position: 'absolute',
            top: '-12',
            right: '12',
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
            bottom: '-10',
            left: '24',
            p: '5',
            bg: 'ocobo.dark',
            color: 'white',
            rounded: '2xl',
            shadow: 'xl',
            transform: 'rotate(-6deg)',
            animation: 'bounce-slow',
            animationDelay: '[1s]',
            display: { base: 'none', md: 'flex' },
          })}
        >
          <Users size={24} />
        </div>
      </div>
    </div>
  );
};
