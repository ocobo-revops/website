import { defineRecipe } from '@pandacss/dev';

export const typography = defineRecipe({
  className: 'typography',
  description: 'The typography recipe is used to style text elements.',
  base: {},
  variants: {
    variant: {
      heading1: {
        textStyle: 'heading1',
      },
      heading2: {
        textStyle: 'heading2',
      },
      heading3: {
        textStyle: 'heading3',
      },
      large: {
        textStyle: 'large',
      },
      medium: {
        textStyle: 'medium',
      },
      small: {
        textStyle: 'small',
      },
      nav: {
        textStyle: 'nav',
      },
    },
    align: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
  },
  defaultVariants: {
    variant: 'medium',
    align: 'left',
  },
});
