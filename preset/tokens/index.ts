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

  // v2 scale (ADR 0002): S 8px, M 16px, L 24px and full. Every older name
  // keeps working and takes the closest v2 value.
  radii: {
    none: { value: '0' },
    sm: { value: '0.5rem' },
    md: { value: '0.5rem' },
    lg: { value: '0.5rem' },
    radius: { value: '0.5rem' },
    xl: { value: '1rem' },
    '2xl': { value: '1rem' },
    '3xl': { value: '1.5rem' },
    full: { value: '9999px' },
  },
  fontWeights,
  lineHeights,
  fonts,
  letterSpacings,
  fontSizes,
  colors,
  // v2 scale (ADR 0002): rest, hover and window. Every older name keeps
  // working and points at the closest v2 shadow. `offset` is the one named
  // exception; `outline` and `ring` are focus rings, not elevation.
  shadows: {
    rest: { value: '0 15px 40px -20px rgba(33, 35, 35, 0.12)' },
    hover: { value: '0 22px 44px -24px rgba(33, 35, 35, 0.24)' },
    window: { value: '0 30px 60px -26px rgba(33, 35, 35, 0.45)' },
    base: { value: '{shadows.rest}' },
    sm: { value: '{shadows.rest}' },
    md: { value: '{shadows.rest}' },
    card: { value: '{shadows.rest}' },
    soft: { value: '{shadows.rest}' },
    lg: { value: '{shadows.hover}' },
    xl: { value: '{shadows.hover}' },
    'soft-md': { value: '{shadows.hover}' },
    'soft-lg': { value: '{shadows.hover}' },
    '2xl': { value: '{shadows.window}' },
    dark: { value: '{shadows.window}' },
    inner: { value: 'none' },
    none: { value: 'none' },
    outline: { value: '0 0 0 3px rgba(66, 153, 225, 0.5)' },
    ring: { value: '0 0 0 10px #fcfcfc' },
    offset: { value: '8px 8px 0px 0px rgba(33,35,35,1)' },
  },
  // AI topics only (ADR 0002). `ai-text` is darkened so each end reaches 3:1
  // on white; gradient text is allowed at display and H2 sizes only.
  gradients: {
    ai: { value: 'linear-gradient(90deg, #FE9C87, #F1CF25)' },
    'ai-text': { value: 'linear-gradient(90deg, #F16C4E, #B88F00)' },
  },
  easings: {
    smooth: { value: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
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
    pulse: { value: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' },
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
