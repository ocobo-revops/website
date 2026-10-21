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
        bg: 'mint',
      },
      coral: {
        bg: 'coral',
      },
    },
    padding: {
      sm: {
        py: '12',
        md: { py: '16' },
      },
      // v2 compact: 64px mobile, 80px from md
      md: {
        py: '16',
        md: { py: '20' },
      },
      // v2 standard: 64px mobile, 80px from md, 112px from lg
      lg: {
        py: '16',
        md: { py: '20' },
        lg: { py: '28' },
      },
    },
  },
  defaultVariants: {
    bg: 'white',
    padding: 'lg',
  },
});
