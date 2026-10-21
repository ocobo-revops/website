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
      md: { p: '7' },
      lg: { p: { base: '7', md: '10' } },
      xl: { p: { base: '7', md: '12' } },
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
        borderColor: 'line',
      },
      false: {},
    },
    shadow: {
      none: { boxShadow: 'none' },
      sm: { boxShadow: 'rest' },
      card: { boxShadow: 'rest' },
      elevated: { boxShadow: 'hover' },
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
