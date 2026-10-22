import type { ComponentProps } from 'react';

import { css, cx } from '@ocobo/styled-system/css';

import { useInView } from '~/hooks/use-in-view';

// A raw transform: Panda's translateY utility moves nothing on its own.
const hidden = css({
  opacity: '0',
  transform: 'translateY(24px)',
});

// The transition sits on the visible state only, so hiding after
// hydration is instant and only the reveal animates.
const visible = css({
  opacity: '1',
  transform: 'none',
  transitionProperty: 'common',
  transitionDuration: 'slowest',
  transitionTimingFunction: 'smooth',
  _motionReduce: { transitionDuration: 'instant' },
});

type RevealProps = ComponentProps<'div'>;

/**
 * Fades and lifts its content into place when it enters the viewport.
 * Visible in the server render and under reduced motion. See `useInView`.
 */
export function Reveal({ className, children, ...props }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-state={inView ? 'visible' : 'hidden'}
      className={cx(inView ? visible : hidden, className)}
      {...props}
    >
      {children}
    </div>
  );
}
