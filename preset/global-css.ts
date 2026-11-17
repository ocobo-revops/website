import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
  html: {
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    WebkitTextSizeAdjust: '100%',
    fontSize: '16px',
  },
  body: {
    bg: 'background',
    color: 'foreground',
    fontFamily: 'body',
    overflowX: 'hidden',
  },

  'p + p, h1 + p,  h2 + p,  h3 + p, h1 + h2, h2 + h3, h2 + table': {
    mt: '1em',
  },

  'p, li, h1, h2, h3, h4, h5, h6': {
    whiteSpace: 'pre-line',
  },

  a: {
    color: 'inherit',
    textDecoration: 'none',
  },

  // Reduced motion (#316). The v1 illustrations loop and float without
  // reading the visitor setting. Under `prefers-reduced-motion: reduce`,
  // every animation jumps to its end frame at once, so entrance animations
  // that start at `opacity: 0` still show their content, and every
  // transition is instant. `!important` is required: in the base layer it
  // wins over the atomic utilities, where the animations are declared.
  // Components that handle reduced motion themselves already resolve to
  // `animation: none` or an `instant` duration, so nothing changes for them.
  '*, *::before, *::after': {
    _motionReduce: {
      animationDuration: 'instant !important',
      animationDelay: 'instant !important',
      animationIterationCount: '1 !important',
      transitionDuration: 'instant !important',
      transitionDelay: 'instant !important',
    },
  },

  '::selection': {
    backgroundColor: 'yellow',
    color: 'dark',
  },
});
