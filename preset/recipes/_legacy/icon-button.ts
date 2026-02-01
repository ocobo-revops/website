import { defineRecipe } from '@pandacss/dev';

export const iconButton = defineRecipe({
  className: 'icon-button',
  description:
    'A button is a clickable element that triggers an action or a state change.',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    rounded: 'full',
    fontWeight: '700',
    transition: 'colors',
    cursor: 'pointer',
    border: 'none',
    p: '2',
    bg: 'transparent',

    _hover: {
      bg: 'gray.light',
    },

    _focusVisible: {
      outline: 'none',
    },

    _disabled: {
      pointerEvents: 'none',
      bg: 'muted',
      color: 'muted.foreground',
      cursor: 'not-allowed',
    },
  },
});
