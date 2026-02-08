import { defineRecipe } from '@pandacss/dev';

export const icon = defineRecipe({
  className: 'icon',
  description: 'Styles for the icons',
  base: {},
  variants: {
    size: {
      xl: {
        h: '8',
        w: '8',
      },
      lg: {
        h: '6',
        w: '6',
      },
      md: {
        h: '4',
        w: '4',
      },
      sm: {
        h: '2',
        w: '2',
      },
      xs: {
        h: '1',
        w: '1',
      },
    },
    left: {
      none: {},
      sm: {
        ml: '2',
      },
      auto: {
        ml: 'auto',
      },
    },
    right: {
      none: {},
      sm: {
        mr: '2',
      },
      auto: {
        mr: 'auto',
      },
    },
    fillCurrent: {
      true: {
        fill: 'currentColor',
      },
    },
    dimmed: {
      true: {
        opacity: '0.5',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    left: 'none',
    right: 'none',
    fillCurrent: false,
    dimmed: false,
  },
});
