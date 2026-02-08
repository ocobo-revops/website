export const colors = {
  current: { value: 'currentColor' },
  transparent: { value: 'transparent' },
  white: { value: '#ffffff' },
  // Ocobo brand colours - matching prototype token names exactly
  ocobo: {
    dark: { value: '#212323' },
    gray: { value: '#F5F5F5' },
    yellow: { value: '#F1CF25' },
    'yellow.light': { value: '#FFFCEE' },
    mint: { value: '#9ADBBA' },
    'mint.light': { value: '#EBFDF5' },
    sky: { value: '#99D1DF' },
    'sky.light': { value: '#F0F9FB' },
    coral: { value: '#FE9C87' },
    'coral.light': { value: '#FFF5F2' },
  },
  // Aliases for backward compatibility during migration
  dark: { value: '#212323' },
  darker: { value: '#000' },
  yellow: {
    DEFAULT: { value: '#F1CF25' },
    light: { value: '#FFFCEE' },
    dark: { value: '#b59b1c' },
  },
  mint: {
    DEFAULT: { value: '#9ADBBA' },
    light: { value: '#EBFDF5' },
    dark: { value: '#5e9177' },
  },
  sky: {
    DEFAULT: { value: '#99D1DF' },
    light: { value: '#F0F9FB' },
    dark: { value: '#608791' },
  },
  coral: {
    DEFAULT: { value: '#FE9C87' },
    light: { value: '#FFF5F2' },
    dark: { value: '#af4934' },
  },
  gray: {
    DEFAULT: { value: '#767676' },
    light: { value: '#F5F5F5' },
    50: { value: '#FAFAFA' },
    100: { value: '#F4F4F5' },
    400: { value: '#A1A1AA' },
    500: { value: '#71717A' },
    600: { value: '#52525B' },
  },
};
