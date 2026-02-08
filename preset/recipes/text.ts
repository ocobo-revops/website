import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
  className: 'text',
  description: 'Typography component styles',
  base: {},
  variants: {
    variant: {
      'display-xl': {
        fontFamily: 'display',
        fontSize: { base: '5xl', md: '6xl' },
        fontWeight: 'bold',
        lineHeight: '0.95',
        letterSpacing: 'tight',
      },
      'display-lg': {
        fontFamily: 'display',
        fontSize: { base: '4xl', md: '5xl' },
        fontWeight: 'black',
        letterSpacing: 'tight',
      },
      'display-md': {
        fontFamily: 'display',
        fontSize: '2xl',
        fontWeight: 'black',
      },
      subtitle: {
        fontSize: 'xl',
        lineHeight: 'relaxed',
        fontWeight: 'medium',
      },
      body: {
        fontSize: 'base',
        lineHeight: 'relaxed',
        fontWeight: 'medium',
      },
      label: {
        fontSize: 'xs',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontWeight: 'semibold',
      },
    },
    color: {
      dark: { color: 'dark' },
      muted: { color: 'gray' },
      'muted-light': { color: 'gray.light' },
      white: { color: 'white' },
      sky: { color: 'sky' },
      mint: { color: 'mint' },
      yellow: { color: 'yellow' },
      coral: { color: 'coral' },
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'dark',
  },
});
