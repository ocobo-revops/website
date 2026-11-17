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
  // animations last 0ms and run once: entrance animations, which all fill
  // `forwards`, show their end frame at once, so content that starts at
  // `opacity: 0` still shows; loops rest on the element's own style.
  // Transitions are instant. Transition delays stay: a delay moves nothing,
  // and the page dimming on navigation relies on one to skip fast loads.
  // `!important` is required: in the base layer it wins over the atomic
  // utilities, where the animations are declared, and over inline styles.
  // A 0ms transition never fires `transitionend`: do not wait on it.
  // An element that sets its own reduced motion behaviour, such as a fade,
  // opts out with the `data-motion-own` attribute (its children do not).
  '*:not([data-motion-own]), *:not([data-motion-own])::before, *:not([data-motion-own])::after':
    {
      _motionReduce: {
        animationDuration: 'instant !important',
        animationDelay: 'instant !important',
        animationIterationCount: '1 !important',
        transitionDuration: 'instant !important',
      },
    },

  '::selection': {
    backgroundColor: 'yellow',
    color: 'dark',
  },
});
