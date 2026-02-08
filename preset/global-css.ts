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

  '::selection': {
    backgroundColor: 'yellow',
    color: 'dark',
  },
});
