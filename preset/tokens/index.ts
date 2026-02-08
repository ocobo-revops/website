import type { Tokens } from '@pandacss/dev';

import { aspectRatios } from './aspect-ratios';
import { borders } from './borders';
import { colors } from './colors';
import { sizes } from './sizes';
import { spacing } from './spacing';
import {
  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  lineHeights,
} from './typography';

const defineTokens = <T extends Tokens>(v: T) => v;

export const tokens = defineTokens({
  aspectRatios,
  borders,

  radii: {
    full: { value: '9999px' },
    radius: { value: '0.5rem' },
    '2xl': { value: '1rem' },
    '3xl': { value: '1.5rem' },
  },
  fontWeights,
  lineHeights,
  fonts,
  letterSpacings,
  fontSizes,
  colors,
  shadows: {
    base: { value: '0px 4px 50px 0px rgba(0, 0, 0, 0.12)' },
    inner: { value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
    outline: { value: '0 0 0 3px rgba(66, 153, 225, 0.5)' },
    sm: {
      value: [
        '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        '0 1px 2px -1px rgb(0 0 0 / 0.1)',
      ],
    },
    md: {
      value: [
        '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        '0 2px 4px -2px rgb(0 0 0 / 0.1)',
      ],
    },
    lg: {
      value: [
        '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        '0 4px 6px -4px rgb(0 0 0 / 0.1)',
      ],
    },
    xl: {
      value: [
        '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '0 8px 10px -6px rgb(0 0 0 / 0.1)',
      ],
    },
    '2xl': { value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
    none: { value: 'none' },
    soft: { value: '0 8px 20px -10px rgba(0,0,0,0.08)' },
    'soft-md': { value: '0 15px 40px -10px rgba(0,0,0,0.12)' },
    'soft-lg': { value: '0 25px 60px -15px rgba(0,0,0,0.15)' },
    dark: { value: '0 30px 100px -20px rgba(0,0,0,0.5)' },
    card: { value: '0 15px 50px -15px rgba(0,0,0,0.05)' },
    ring: { value: '0 0 0 10px #fcfcfc' },
    offset: { value: '8px 8px 0px 0px rgba(33,35,35,1)' },
  },
  blurs: {
    base: { value: '8px' },
  },
  animations: {
    'float-cursor': { value: 'float-cursor 5s infinite ease-in-out' },
    'float-very-slow': { value: 'float-very-slow 12s ease-in-out infinite' },
    'float-gentle': { value: 'float-gentle 8s ease-in-out infinite' },
    'float-grid': { value: 'float-grid 6s ease-in-out infinite' },
    'float-blob': { value: 'float-blob 12s infinite ease-in-out' },
    'slow-fade': { value: 'slow-fade 6s infinite ease-in-out' },
    'fade-in-up': {
      value: 'fade-in-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
    'fade-in-up-small': {
      value:
        'fade-in-up-small 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
    'hero-reveal': {
      value: 'hero-reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
    'gentle-reveal': {
      value: 'gentle-reveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
    'bounce-slow': { value: 'bounce-slow 3s ease-in-out infinite' },
    'bounce-subtle': { value: 'bounce-subtle 3s ease-in-out infinite' },
    'spin-slow': { value: 'spin-slow 20s linear infinite' },
    'radar-sweep': { value: 'radar-sweep 10s linear infinite' },
    'marquee-ultra-slow': {
      value: 'marquee-ultra-slow 90s linear infinite',
    },
    'blueprint-in': {
      value: 'blueprint-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
    'box-pop': {
      value: 'box-pop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
    },
  },
  spacing,
  sizes,
  assets: {
    checked: {
      value: {
        type: 'svg',
        value:
          '<svg width="38" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 38 27"><path stroke="#9ADBBA" stroke-width="5" d="m1.768 10.232 11 11M35.768 1.768l-23 23"/></svg>',
      },
    },
    unchecked: {
      value: {
        type: 'svg',
        value:
          '<svg height="27" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 27"><path stroke="#FE9C87" stroke-width="5" d="m25.768 1.768-23 23M25.232 24.768l-23-23"/></svg>',
      },
    },
  },
});
