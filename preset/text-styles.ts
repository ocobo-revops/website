import { defineTextStyles } from '@pandacss/dev';

// Legacy text styles mapped onto the v2 type scale (ADR 0002). New code uses
// the text() recipe instead.
const h2 = {
  fontFamily: 'display',
  fontWeight: 900,
  fontSize: 'h2',
  lineHeight: 'heading',
  letterSpacing: 'tight',
};

const h3 = {
  fontFamily: 'body',
  fontWeight: 700,
  fontSize: 'h3',
  lineHeight: 'snug',
};

const body = {
  fontFamily: 'body',
  fontWeight: 400,
  fontSize: 'body',
  lineHeight: 'body',
};

export const textStyles = defineTextStyles({
  heading1: { value: h2 },
  heading2: { value: h2 },
  heading3: { value: h3 },
  small: {
    value: {
      fontFamily: 'body',
      fontWeight: 500,
      fontSize: 'sm',
      lineHeight: 'normal',
    },
  },
  medium: { value: body },
  large: { value: body },
  nav: { value: { ...body, lineHeight: 1 } },
});
