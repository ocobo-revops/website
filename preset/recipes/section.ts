import { defineRecipe } from '@pandacss/dev';

export const section = defineRecipe({
  className: 'section',
  description: 'Section component styles',
  base: {},
  variants: {
    bg: {
      white: {
        bg: 'white',
      },
      gray: {
        bg: 'gray.light',
      },
      dark: {
        bg: 'dark',
        color: 'white',
      },
      yellow: {
        bg: 'yellow',
        color: 'dark',
      },
      sky: {
        bg: 'sky',
      },
      mint: {
        bg: 'mint.light',
      },
      coral: {
        bg: 'coral.light',
      },
    },
    padding: {
      sm: {
        py: '12',
        md: { py: '16' },
      },
      md: {
        py: '16',
        md: { py: '24' },
      },
      lg: {
        py: '24',
      },
    },
  },
  defaultVariants: {
    bg: 'white',
    padding: 'lg',
  },
});
