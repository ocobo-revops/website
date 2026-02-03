import { css } from '@ocobo/styled-system/css';

import type { Color } from './types';

/**
 * Icon background/colour styles per colour variant.
 * Shared between desktop dropdown items and mobile menu items.
 */
export const iconStyles: Record<Color, string> = {
  yellow: css({ bg: 'ocobo.yellow/10', color: 'ocobo.yellow' }),
  sky: css({ bg: 'ocobo.sky/10', color: 'ocobo.sky' }),
  coral: css({ bg: 'ocobo.coral/10', color: 'ocobo.coral' }),
  mint: css({ bg: 'ocobo.mint/10', color: 'ocobo.mint' }),
};

/**
 * Hover background styles for dropdown items.
 */
export const hoverStyles: Record<Color, string> = {
  yellow: css({ _hover: { bg: 'ocobo.yellow.light' } }),
  sky: css({ _hover: { bg: 'ocobo.sky.light' } }),
  coral: css({ _hover: { bg: 'ocobo.coral.light' } }),
  mint: css({ _hover: { bg: 'ocobo.mint.light' } }),
};

/**
 * Text colour on hover for dropdown item labels.
 */
export const hoverTextStyles: Record<Color, string> = {
  yellow: css({ _groupHover: { color: 'ocobo.yellow' } }),
  sky: css({ _groupHover: { color: 'ocobo.sky' } }),
  coral: css({ _groupHover: { color: 'ocobo.coral' } }),
  mint: css({ _groupHover: { color: 'ocobo.mint' } }),
};

/**
 * Scroll threshold in pixels before navbar transitions to "scrolled" state.
 */
export const SCROLL_THRESHOLD = 30;
