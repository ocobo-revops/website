import { defineRecipe } from '@pandacss/dev';

export const card = defineRecipe({
  className: 'card',
  description:
    'Card component — bordered white rounded container, used for standalone content blocks',
  base: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'sm',
  },
  variants: {
    padding: {
      sm: { p: '4' },
      md: { p: '6' },
      lg: { p: '8' },
    },
    radius: {
      md: { borderRadius: '2xl' },
      lg: { borderRadius: '3xl' },
    },
    tone: {
      white: { bg: 'white' },
      tinted: { bg: 'gray.50' },
    },
    border: {
      true: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'gray.100',
      },
      false: {},
    },
  },
  defaultVariants: {
    padding: 'md',
    radius: 'md',
    tone: 'white',
    border: true,
  },
});
