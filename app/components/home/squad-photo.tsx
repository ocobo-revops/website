import { Sparkles, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

const bracket = css({
  position: 'absolute',
  w: '16',
  h: '16',
  borderColor: 'dark/12',
  transitionProperty: 'colors',
  transitionDuration: 'slower',
});

const tile = css({
  position: 'absolute',
  display: { base: 'none', md: 'flex' },
  p: '4',
  rounded: '2xl',
  boxShadow: 'hover',
  animation: 'bounce-slow',
  _motionReduce: { animation: '[none]' },
});

/**
 * The team photo of the method block (`tp8` in the mockup): a framed,
 * greyscale picture that takes its colours and its label on hover.
 */
export function SquadPhoto() {
  const { t } = useTranslation('home');
  return (
    <div
      className={cx(
        'group',
        css({
          position: 'relative',
          maxW: '4xl',
          mx: 'auto',
          mb: '20',
          px: '4',
        }),
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          bracket,
          css({
            top: '-5',
            left: '-2',
            borderTopWidth: '2px',
            borderLeftWidth: '2px',
            _groupHover: { borderColor: 'yellow' },
          }),
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          bracket,
          css({
            bottom: '-5',
            right: '-2',
            borderBottomWidth: '2px',
            borderRightWidth: '2px',
            _groupHover: { borderColor: 'mint' },
          }),
        )}
      />
      <div
        className={css({
          position: 'relative',
          p: '2.5',
          overflow: 'hidden',
          bg: 'white',
          borderWidth: '1px',
          borderColor: 'gray.light',
          rounded: '3xl',
          boxShadow: 'hover',
          transitionProperty: 'common',
          transitionDuration: 'slower',
          _groupHover: { transform: 'scale(1.01)' },
          _motionReduce: { _groupHover: { transform: 'none' } },
        })}
      >
        <img
          src="/images/home/squad.webp"
          alt={t('interventions.squad.alt')}
          width={1400}
          height={1050}
          loading="lazy"
          decoding="async"
          className={css({
            display: 'block',
            w: 'full',
            h: 'auto',
            rounded: '2xl',
            filter: '[grayscale(1) contrast(1.1) brightness(1.05)]',
            transitionProperty: '[filter]',
            transitionDuration: '[1s]',
            _groupHover: { filter: '[none]' },
            _motionReduce: { transition: '[none]' },
          })}
        />
        <p
          className={cx(
            text({ variant: 'label' }),
            css({
              position: 'absolute',
              bottom: { base: '5', md: '8' },
              left: { base: '5', md: '8' },
              display: 'flex',
              alignItems: 'center',
              gap: '2.5',
              px: '5',
              py: '3',
              bg: 'white/92',
              rounded: '2xl',
              boxShadow: 'hover',
              // Shown on hover from tablet up; always shown on touch screens.
              opacity: { base: '1', md: '0' },
              transform: { base: 'none', md: 'translateY(16px)' },
              transitionProperty: 'common',
              transitionDuration: 'slow',
              _groupHover: { opacity: '1', transform: 'none' },
            }),
          )}
        >
          <span
            aria-hidden="true"
            className={css({
              w: '2.5',
              h: '2.5',
              rounded: 'full',
              bg: 'mint',
              animation: 'pulse',
              _motionReduce: { animation: '[none]' },
            })}
          />
          {t('interventions.squad.label')}
        </p>
      </div>
      <span
        aria-hidden="true"
        className={cx(
          tile,
          css({
            top: '-8',
            right: '14',
            bg: 'white',
            color: 'yellow',
            borderWidth: '1px',
            borderColor: 'gray.light',
          }),
        )}
      >
        <Sparkles size={28} className={css({ transform: 'rotate(12deg)' })} />
      </span>
      <span
        aria-hidden="true"
        className={cx(
          tile,
          css({
            bottom: '-8',
            left: '20',
            bg: 'dark',
            color: 'white',
            animationDelay: '[1s]',
          }),
        )}
      >
        <Users size={24} className={css({ transform: 'rotate(-6deg)' })} />
      </span>
    </div>
  );
}
