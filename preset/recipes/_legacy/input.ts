import { defineRecipe } from '@pandacss/dev';

export const input = defineRecipe({
  className: 'input',
  description:
    'An input is a field that allows users to enter text, numbers, or other data.',
  base: {
    width: 'full',
    height: 'input',
    px: '2',
    border: 'thin',
    borderColor: 'white',
    backgroundColor: 'white',

    _placeholder: { color: 'gray' },

    _focusVisible: {
      outline: 'none',
      borderColor: 'gray',
    },

    _disabled: {
      pointerEvents: 'none',
      bg: 'gray.light',
      borderColor: 'gray.light',
      color: 'gray',
      cursor: 'not-allowed',
    },
  },
  variants: {
    error: {
      true: {
        color: 'coral.dark',
        borderColor: 'coral.dark',
        bg: 'coral.light',
      },
    },
  },
  defaultVariants: {},
});
