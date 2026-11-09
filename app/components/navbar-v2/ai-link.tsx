import { NavLink } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';

import { topLinkStyles } from './nav-styles';

type AiLinkProps = {
  label: string;
  path: string;
};

/**
 * Ring shown left of the label on hover and keyboard focus: a gradient
 * circle, a sweep turning inside it and a coral ping. It reuses the
 * `radar-sweep` and `stack-ping` keyframes of the preset. Desktop pointers
 * only, as in the prototype. Under reduced motion the ring still appears,
 * but nothing turns or pings.
 */
const ringStyles = css({
  position: 'absolute',
  left: '[-3px]',
  top: '[50%]',
  w: '3.5',
  h: '3.5',
  mt: '[-7px]',
  opacity: 0,
  transform: 'scale(.3)',
  transitionProperty: '[opacity, transform]',
  transitionDuration: 'slow',
  transitionTimingFunction: 'smooth',
  pointerEvents: 'none',
  '@media (hover: none)': { display: 'none' },
  // Animations only exist when motion is allowed, so no override has to
  // win over the hover selectors below.
  _motionSafe: {
    '& .ai-ring-sweep': {
      animation: '[radar-sweep 1.6s linear infinite]',
      animationPlayState: 'paused',
    },
  },
  _motionReduce: { transitionDuration: 'instant' },
});

const linkStyles = css({
  position: 'relative',
  '&:hover .ai-ring, &:focus-visible .ai-ring': {
    opacity: 1,
    transform: 'scale(1)',
  },
  _motionSafe: {
    '&:hover .ai-ring-sweep, &:focus-visible .ai-ring-sweep': {
      animationPlayState: 'running',
    },
    '&:hover .ai-ring-ping, &:focus-visible .ai-ring-ping': {
      animation: '[stack-ping 1.6s 0.2s ease-out infinite]',
    },
  },
});

/**
 * Top-level link to the Revenue AI challenge page. The label stays plain
 * text, as in the prototype: no gradient text.
 */
export function AiLink({ label, path }: AiLinkProps) {
  return (
    <NavLink to={path} className={cx(topLinkStyles, linkStyles)}>
      <span aria-hidden="true" className={cx('ai-ring', ringStyles)}>
        <span
          className={css({
            position: 'absolute',
            inset: '0',
            rounded: 'full',
            bgGradient: 'ai',
          })}
        />
        <span
          className={css({
            position: 'absolute',
            inset: '[1.5px]',
            rounded: 'full',
            bg: 'white',
            overflow: 'hidden',
          })}
        >
          <span
            className={cx(
              'ai-ring-sweep',
              css({
                position: 'absolute',
                inset: '0',
                rounded: 'full',
                bgImage:
                  '[conic-gradient(from 0deg, transparent 220deg, var(--colors-ocobo-coral) 320deg, var(--colors-ocobo-yellow) 360deg)]',
              }),
            )}
          />
          <span
            className={css({
              position: 'absolute',
              left: '[50%]',
              top: '[50%]',
              w: '[3px]',
              h: '[3px]',
              transform: 'translate(-50%, -50%)',
              rounded: 'full',
              bg: 'dark',
            })}
          />
        </span>
        <span
          className={cx(
            'ai-ring-ping',
            css({
              position: 'absolute',
              inset: '0',
              rounded: 'full',
              borderWidth: '1px',
              borderColor: 'ocobo.coral',
              opacity: 0,
            }),
          )}
        />
      </span>
      {label}
    </NavLink>
  );
}
