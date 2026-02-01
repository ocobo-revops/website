import { defineRecipe } from '@pandacss/dev';

export const iconBox = defineRecipe({
  className: 'icon-box',
  description: 'Icon container component styles',
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  variants: {
    size: {
      sm: { w: '8', h: '8', rounded: 'md' },
      md: { w: '10', h: '10', rounded: 'md' },
      lg: { w: '16', h: '16', rounded: 'lg' },
    },
    variant: {
      solid: {},
      outline: {
        borderWidth: '1px',
        borderStyle: 'solid',
      },
      ghost: {
        bg: 'transparent',
      },
    },
    color: {
      default: {},
      sky: {},
      mint: {},
      yellow: {},
      coral: {},
    },
  },
  compoundVariants: [
    { variant: 'solid', color: 'default', css: { bg: 'dark', color: 'white' } },
    { variant: 'solid', color: 'sky', css: { bg: 'sky', color: 'dark' } },
    { variant: 'solid', color: 'mint', css: { bg: 'mint', color: 'dark' } },
    { variant: 'solid', color: 'yellow', css: { bg: 'yellow', color: 'dark' } },
    { variant: 'solid', color: 'coral', css: { bg: 'coral', color: 'dark' } },
    {
      variant: 'outline',
      color: 'default',
      css: { borderColor: 'dark', color: 'dark' },
    },
    {
      variant: 'outline',
      color: 'sky',
      css: { borderColor: 'sky', color: 'sky' },
    },
    {
      variant: 'outline',
      color: 'mint',
      css: { borderColor: 'mint', color: 'mint' },
    },
    {
      variant: 'outline',
      color: 'yellow',
      css: { borderColor: 'yellow', color: 'yellow' },
    },
    {
      variant: 'outline',
      color: 'coral',
      css: { borderColor: 'coral', color: 'coral' },
    },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'solid',
    color: 'default',
  },
});
