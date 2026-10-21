import { spacing } from './spacing';

const largeSizes = {
  xs: { value: '15rem' },
  sm: { value: '24rem' },
  md: { value: '28rem' },
  lg: { value: '32rem' },
  xl: { value: '36rem' },
  '2xl': { value: '42rem' },
  '3xl': { value: '48rem' },
  '4xl': { value: '56rem' },
  '5xl': { value: '64rem' },
  '6xl': { value: '72rem' },
  '7xl': { value: '80rem' },
  '8xl': { value: '82rem' },
  prose: { value: '65ch' },
  // Eyebrow dot (ADR 0002): the mockup's 7px, on no spacing step.
  dot: { value: '7px' },
};

export const sizes = {
  ...spacing,
  ...largeSizes,
  full: { value: '100%' },
  screen: { value: '100vw' },
  mobile: { value: '84vw' },
  desktop: { value: '75rem' },
  xlarge: { value: '82rem' },
  min: { value: 'min-content' },
  max: { value: 'max-content' },
  fit: { value: 'fit-content' },
  input: { value: '40px' },
};
