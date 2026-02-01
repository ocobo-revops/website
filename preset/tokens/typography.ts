import { type Tokens } from '@pandacss/dev';

export const fontSizes: Tokens['fontSizes'] = {
  '2xs': { value: '0.5rem' },
  xs: { value: '0.75rem' },
  sm: { value: '0.875rem' },
  md: { value: '1rem' },
  lg: { value: '1.125rem' },
  xl: { value: '1.25rem' },
  '2xl': { value: '1.375rem' },
  '3xl': { value: '1.875rem' },
  '4xl': { value: '2.25rem' },
  '5xl': { value: '3rem' },
  '6xl': { value: '3.75rem' },
  '7xl': { value: '4.5rem' },
  '8xl': { value: '6rem' },
  '9xl': { value: '8rem' },
};

export const fontWeights: Tokens['fontWeights'] = {
  thin: { value: '100' },
  extralight: { value: '200' },
  light: { value: '300' },
  normal: { value: '400' },
  medium: { value: '500' },
  semibold: { value: '600' },
  bold: { value: '700' },
  extrabold: { value: '800' },
  black: { value: '900' },
};

export const letterSpacings: Tokens['letterSpacings'] = {
  tighter: { value: '-0.05em' },
  tight: { value: '-0.025em' },
  normal: { value: '0em' },
  wide: { value: '0.025em' },
  wider: { value: '0.05em' },
  widest: { value: '0.1em' },
};

export const lineHeights: Tokens['lineHeights'] = {
  none: { value: '1' },
  tight: { value: '1.25' },
  snug: { value: '1.375' },
  normal: { value: '1.5' },
  relaxed: { value: '1.625' },
  loose: { value: '2' },
  xs: { value: '1.2' },
  sm: { value: '1.4' },
  base: { value: '1.5' },
  lg: { value: '1.4' },
  xl: { value: '1.3' },
  '2xl': { value: '1.25' },
  '3xl': { value: '1.2' },
  '4xl': { value: '1.1' },
  '5xl': { value: '1' },
  '6xl': { value: '1' },
};

export const fonts: Tokens['fonts'] = {
  body: {
    value: ['Bornia', 'Inter', 'sans-serif'],
  },
  header: {
    value: ['Bermia', 'Inter', 'sans-serif'],
  },
  sans: {
    value: ['Bornia', 'Inter', 'sans-serif'],
  },
  display: {
    value: ['Bermia', 'Inter', 'sans-serif'],
  },
};
