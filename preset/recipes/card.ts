import { defineRecipe } from '@pandacss/dev';

export const card = defineRecipe({
  className: 'card',
  description:
    'Card component — bordered white rounded container, used for standalone content blocks',
  base: {
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    padding: {
      sm: { p: '4' },
      md: { p: '6' },
      lg: { p: '8' },
      xl: { p: { base: '8', md: '12' } },
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
    shadow: {
      none: { boxShadow: 'none' },
      sm: { boxShadow: 'sm' },
      card: { boxShadow: 'card' },
      elevated: { boxShadow: 'xl' },
    },
  },
  defaultVariants: {
    padding: 'md',
    radius: 'md',
    tone: 'white',
    border: true,
    shadow: 'sm',
  },
});
