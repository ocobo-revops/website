import { defineRecipe } from '@pandacss/dev';

export const badge = defineRecipe({
  className: 'badge',
  description: 'Badge component styles',
  base: {
    display: 'inline-block',
    fontFamily: 'display',
    fontWeight: 'black',
    textTransform: 'uppercase',
    borderRadius: 'full',
  },
  variants: {
    variant: {
      yellow: {
        color: 'dark',
        bg: 'yellow',
      },
      mint: {
        color: 'dark',
        bg: 'mint',
      },
      sky: {
        color: 'dark',
        bg: 'sky',
      },
      coral: {
        color: 'dark',
        bg: 'coral',
      },
    },
    size: {
      sm: {
        px: '4',
        py: '1.5',
        fontSize: 'xs',
        letterSpacing: '0.3em',
      },
      lg: {
        px: '6',
        py: '2',
        fontSize: 'xs',
        letterSpacing: '0.3em',
      },
    },
  },
  defaultVariants: {
    variant: 'yellow',
    size: 'sm',
  },
});
