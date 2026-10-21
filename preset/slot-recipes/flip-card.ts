import { defineSlotRecipe } from '@pandacss/dev';

// Both faces share the same box: stacked over each other, the one turned away
// hidden by `backfaceVisibility`. A face scrolls rather than cutting its text
// when the fixed height is too short (narrow screens, text spacing overrides).
const face = {
  position: 'absolute',
  inset: '0',
  display: 'flex',
  flexDirection: 'column',
  p: '7',
  borderRadius: '2xl',
  overflowY: 'auto',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
} as const;

/**
 * Card that turns over to show its back (ADR 0002). The `FlipCard`
 * component drives `data-state` on the inner slot from its button, a tap or
 * a mouse hover; this recipe only renders that state.
 */
export const flipCard = defineSlotRecipe({
  className: 'flip-card',
  description: 'Card that flips between a front and a back face',
  jsx: ['FlipCard'],
  slots: ['root', 'trigger', 'inner', 'front', 'back'],
  base: {
    root: {
      position: 'relative',
      width: 'full',
      perspective: '1200px',
    },
    trigger: {
      position: 'absolute',
      top: '4',
      right: '4',
      zIndex: '1',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      w: '10',
      h: '10',
      borderRadius: 'full',
      bg: 'gray.100',
      color: 'gray.600',
      cursor: 'pointer',
      transition: 'colors',
      transitionDuration: 'normal',
      _hover: { bg: 'gray.200', color: 'dark' },
      _focusVisible: {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: 'dark',
        outlineOffset: '0',
        // Light halo keeps the dark ring visible on dark or coloured backs.
        boxShadow: 'ring',
      },
      '& > svg': { w: '4', h: '4' },
    },
    inner: {
      position: 'relative',
      width: 'full',
      height: 'full',
      transformStyle: 'preserve-3d',
      transition: 'transform',
      transitionDuration: 'slowest',
      transitionTimingFunction: 'smooth',
      '&[data-state=back]': { transform: 'rotateY(180deg)' },
      _motionReduce: { transitionDuration: 'instant' },
    },
    front: {
      ...face,
      // Its own transform keeps Safari from flickering through the back.
      transform: 'rotateY(0deg)',
      bg: 'white',
      color: 'dark',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'line',
      boxShadow: 'rest',
    },
    back: {
      ...face,
      bg: 'dark',
      color: 'white',
      transform: 'rotateY(180deg)',
    },
  },
  variants: {
    // Fixed heights: `md` for tool cards, `lg` for the home challenge cards.
    size: {
      md: { root: { h: '72' } },
      lg: { root: { h: 'lg' } },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
