import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
  className: 'text',
  description: 'Typography component styles',
  base: {},
  variants: {
    // v2 type scale (ADR 0002): six sizes. Kept names are display-xl,
    // display-lg, display-md-bold, body, small and label; every other name
    // takes the value of its size and is retired page by page.
    variant: {
      // Display
      'display-xl': {
        fontFamily: 'display',
        fontSize: 'display',
        fontWeight: 'black',
        lineHeight: 'none',
        letterSpacing: 'tight',
      },
      'display-2xl': {
        fontFamily: 'display',
        fontSize: 'display',
        fontWeight: 'black',
        lineHeight: 'none',
        letterSpacing: 'tight',
      },
      // H2
      'display-lg': {
        fontFamily: 'display',
        fontSize: 'h2',
        fontWeight: 'black',
        lineHeight: 'heading',
        letterSpacing: 'tight',
      },
      'display-lg-bold': {
        fontFamily: 'display',
        fontSize: 'h2',
        fontWeight: 'black',
        lineHeight: 'heading',
        letterSpacing: 'tight',
      },
      'display-section': {
        fontFamily: 'display',
        fontSize: 'h2',
        fontWeight: 'black',
        lineHeight: 'heading',
        letterSpacing: 'tight',
      },
      'display-sm': {
        fontFamily: 'display',
        fontSize: 'h2',
        fontWeight: 'black',
        lineHeight: 'heading',
        letterSpacing: 'tight',
      },
      'display-heading': {
        fontFamily: 'display',
        fontSize: 'h2',
        fontWeight: 'black',
        lineHeight: 'heading',
        letterSpacing: 'tight',
      },
      // H3
      'display-md-bold': {
        fontFamily: 'body',
        fontSize: 'h3',
        fontWeight: 'bold',
        lineHeight: 'snug',
      },
      'display-md': {
        fontFamily: 'body',
        fontSize: 'h3',
        fontWeight: 'bold',
        lineHeight: 'snug',
      },
      'display-card': {
        fontFamily: 'body',
        fontSize: 'h3',
        fontWeight: 'bold',
        lineHeight: 'snug',
      },
      // Body
      body: {
        fontSize: 'body',
        fontWeight: 'normal',
        lineHeight: 'body',
      },
      subtitle: {
        fontSize: 'body',
        fontWeight: 'normal',
        lineHeight: 'body',
      },
      // Small
      small: {
        fontSize: 'sm',
        fontWeight: 'medium',
        lineHeight: 'normal',
      },
      // Label
      label: {
        fontSize: 'label',
        fontWeight: 'bold',
        letterSpacing: 'label',
        textTransform: 'uppercase',
      },
      'display-label': {
        fontSize: 'label',
        fontWeight: 'bold',
        letterSpacing: 'label',
        textTransform: 'uppercase',
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
