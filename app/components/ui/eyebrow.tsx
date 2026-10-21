import type { ReactNode } from 'react';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

// Static literals per branch: Panda cannot extract values read from a map.
const dotColors = {
  yellow: css({ bg: 'yellow' }),
  sky: css({ bg: 'sky' }),
  mint: css({ bg: 'mint' }),
  coral: css({ bg: 'coral' }),
};

const dot = css({
  display: 'inline-block',
  flexShrink: 0,
  h: 'dot',
  w: 'dot',
  rounded: 'full',
});

const root = cx(
  text({ variant: 'label', color: 'muted' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2',
    letterSpacing: 'tag',
  }),
);

type EyebrowProps = {
  children: ReactNode;
  /** Adds a 7px dot in this colour before the text. */
  dotColor?: keyof typeof dotColors;
  className?: string;
};

export function Eyebrow({ children, dotColor, className }: EyebrowProps) {
  return (
    <span className={cx(root, className)}>
      {dotColor ? (
        <span aria-hidden="true" className={cx(dot, dotColors[dotColor])} />
      ) : null}
      {children}
    </span>
  );
}
