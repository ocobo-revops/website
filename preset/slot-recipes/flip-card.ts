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
  // WebKit paints the turned-away face through `backfaceVisibility`
  // (mirrored back over the front at rest), so the turned-away face is also
  // hidden. The swap waits until the turn passes 90deg (`flip-swap`), so
  // neither face is blank mid-turn.
  transitionProperty: 'visibility',
  transitionDuration: 'instant',
  transitionDelay: 'flip-swap',
  _motionReduce: { transitionDelay: 'instant' },
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
      // The mockup hint: 28px, 14px from the corner (above the 24px target
      // minimum of WCAG 2.5.8).
      top: '3.5',
      right: '3.5',
      zIndex: '1',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      w: '7',
      h: '7',
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
      '& > svg': { w: '3.5', h: '3.5' },
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
      '[data-state=back] > &': { visibility: 'hidden' },
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
      '[data-state=front] > &': { visibility: 'hidden' },
    },
  },
  variants: {
    // Fixed heights: `md` for tool cards, `lg` for the home challenge cards.
    size: {
      md: { root: { h: '72' } },
      lg: { root: { h: 'lg' } },
    },
    // `person` lays out the PersonCard faces: a centred front (photo, name,
    // role, challenge label) and a tighter back. It keeps the `md` height.
    variant: {
      default: {},
      person: {
        front: {
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3',
          px: '4',
          pt: '6',
          pb: '5',
          textAlign: 'center',
        },
        back: {
          gap: '1.5',
          p: '5',
          bg: 'gray.50',
          color: 'dark',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});
