import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
  className: 'text',
  description: 'Typography component styles',
  base: {},
  variants: {
    variant: {
      'display-2xl': {
        fontFamily: 'display',
        fontSize: { base: '4xl', md: '6xl' },
        fontWeight: 'black',
        letterSpacing: 'tight',
      },
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
      'display-lg-bold': {
        fontFamily: 'display',
        fontSize: { base: '4xl', md: '5xl' },
        fontWeight: 'bold',
        letterSpacing: 'tight',
      },
      'display-section': {
        fontFamily: 'display',
        fontSize: { base: '3xl', md: '5xl' },
        fontWeight: 'bold',
        lineHeight: 'tight',
      },
      'display-sm': {
        fontFamily: 'display',
        fontSize: { base: '3xl', md: '4xl' },
        fontWeight: 'black',
        letterSpacing: 'tight',
      },
      'display-md': {
        fontFamily: 'display',
        fontSize: '2xl',
        fontWeight: 'black',
      },
      'display-md-bold': {
        fontFamily: 'display',
        fontSize: '2xl',
        fontWeight: 'bold',
      },
      'display-heading': {
        fontFamily: 'display',
        fontSize: { base: '2xl', md: '3xl' },
        fontWeight: 'bold',
      },
      'display-card': {
        fontFamily: 'display',
        fontSize: 'xl',
        fontWeight: 'bold',
      },
      'display-label': {
        fontFamily: 'display',
        fontSize: 'xs',
        fontWeight: 'black',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
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
