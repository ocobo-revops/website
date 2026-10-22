import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { Color, DropdownItemTint } from '~/components/navbar/types';

/**
 * Icon box tint per colour, shared by the desktop panels and the mobile
 * accordion. Static literals so Panda extracts every branch.
 */
export const iconTint: Record<Color, string> = {
  yellow: css({ bg: 'ocobo.yellow/10', color: 'ocobo.yellow' }),
  sky: css({ bg: 'ocobo.sky/10', color: 'ocobo.sky' }),
  coral: css({ bg: 'ocobo.coral/10', color: 'ocobo.coral' }),
  mint: css({ bg: 'ocobo.mint/10', color: 'ocobo.mint' }),
};

/**
 * Panel item background on hover and keyboard focus.
 */
export const itemHoverTint: Record<Color, string> = {
  yellow: css({
    _hover: { bg: 'ocobo.yellow.light' },
    _focusVisible: { bg: 'ocobo.yellow.light' },
  }),
  sky: css({
    _hover: { bg: 'ocobo.sky.light' },
    _focusVisible: { bg: 'ocobo.sky.light' },
  }),
  coral: css({
    _hover: { bg: 'ocobo.coral.light' },
    _focusVisible: { bg: 'ocobo.coral.light' },
  }),
  mint: css({
    _hover: { bg: 'ocobo.mint.light' },
    _focusVisible: { bg: 'ocobo.mint.light' },
  }),
};

/**
 * Same roles for an item that sets `colorPalette` (challenge entries).
 */
const paletteIconTint = css({ bg: 'colorPalette/10', color: 'colorPalette' });
const paletteItemHoverTint = css({
  _hover: { bg: 'colorPalette.light' },
  _focusVisible: { bg: 'colorPalette.light' },
});

/**
 * Icon box and hover tint of one panel item. A palette item carries its
 * palette class on each element.
 */
export function panelItemTint(item: DropdownItemTint) {
  if (item.palette !== undefined) {
    return {
      icon: cx(item.palette, paletteIconTint),
      hover: cx(item.palette, paletteItemHoverTint),
    };
  }
  return { icon: iconTint[item.color], hover: itemHoverTint[item.color] };
}

/**
 * Top-level desktop entry: link or disclosure button.
 */
export const topLinkStyles = cx(
  text({ variant: 'small' }),
  css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
    px: '4',
    py: '2',
    rounded: 'full',
    fontWeight: 'bold',
    color: 'gray',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'colors',
    _hover: { color: 'dark' },
    _expanded: { color: 'dark' },
    '&[aria-current="page"]': { color: 'dark' },
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'dark',
      outlineOffset: '0.5',
    },
  }),
);

export const focusRing = css({
  _focusVisible: {
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineColor: 'dark',
    outlineOffset: '0.5',
  },
});
