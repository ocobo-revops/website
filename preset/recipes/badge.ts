import { defineRecipe } from '@pandacss/dev';

export const badge = defineRecipe({
  className: 'badge',
  description: 'Badge component styles',
  base: {
    display: 'inline-block',
    fontFamily: 'display',
    fontWeight: 'black',
    textTransform: 'uppercase',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  variants: {
    variant: {
      yellow: {
        color: 'dark',
        bg: 'yellow.light',
        borderColor: 'yellow/20',
      },
      mint: {
        color: 'dark',
        bg: 'mint.light',
        borderColor: 'mint/20',
      },
      sky: {
        color: 'sky',
        bg: 'sky.light',
        borderColor: 'sky/20',
      },
      coral: {
        color: 'coral',
        bg: 'coral.light',
        borderColor: 'coral/20',
      },
      dark: {
        color: 'white',
        bg: 'dark',
        borderColor: 'dark/20',
      },
      gray: {
        color: 'gray',
        bg: 'gray.light',
        borderColor: 'gray',
      },
    },
    size: {
      sm: {
        px: '4',
        py: '1.5',
        fontSize: 'xs',
        letterSpacing: '0.3em',
      },
      md: {
        px: '6',
        py: '2',
        fontSize: 'xs',
        letterSpacing: '0.3em',
      },
    },
    rounded: {
      sm: {
        borderRadius: 'sm',
      },
      full: {
        borderRadius: 'full',
      },
    },
  },
  defaultVariants: {
    variant: 'yellow',
    size: 'sm',
    rounded: 'sm',
  },
});
