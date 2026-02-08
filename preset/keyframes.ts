import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  enter: {
    from: {
      opacity: 'var(--shadow-panda-enter-opacity, 1)',
      transform:
        'translate3d(var(--shadow-panda-enter-translate-x, 0), var(--shadow-panda-enter-translate-y, 0), 0) scale3d(var(--shadow-panda-enter-scale, 1), var(--shadow-panda-enter-scale, 1), var(--shadow-panda-enter-scale, 1)) rotate(var(--shadow-panda-enter-rotate, 0))',
    },
  },
  exit: {
    to: {
      opacity: 'var(--shadow-panda-exit-opacity, 1)',
      transform:
        'translate3d(var(--shadow-panda-exit-translate-x, 0), var(--shadow-panda-exit-translate-y, 0), 0) scale3d(var(--shadow-panda-exit-scale, 1), var(--shadow-panda-exit-scale, 1), var(--shadow-panda-exit-scale, 1)) rotate(var(--shadow-panda-exit-rotate, 0))',
    },
  },
  'accordion-down': {
    from: { height: 0 },
    to: { height: 'var(--height)' }, // Ark UI provides --height CSS variable
  },
  'accordion-up': {
    from: { height: 'var(--height)' }, // Ark UI provides --height CSS variable
    to: { height: 0 },
  },
  slide: {
    '0%': { left: 0 },
    '100%': { left: '-100%' },
  },
  scaleProgress: {
    '0%': { transform: 'scaleX(0)' },
    '100%': { transform: 'scaleX(1)' },
  },
  'float-cursor': {
    '0%, 100%': { transform: 'translate(430px, 430px) rotate(-10deg)' },
    '50%': { transform: 'translate(440px, 420px) rotate(-5deg)' },
  },
  'float-very-slow': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-12px)' },
  },
  'float-gentle': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-15px) rotate(2deg)' },
  },
  'float-grid': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  'float-blob': {
    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
  },
  'slow-fade': {
    '0%, 100%': { opacity: '0.1' },
    '50%': { opacity: '0.85' },
  },
  'fade-in-up': {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-in-up-small': {
    from: { opacity: '0', transform: 'translateY(15px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'hero-reveal': {
    from: { opacity: '0', transform: 'translateY(15px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'gentle-reveal': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'bounce-slow': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(6px)' },
  },
  'bounce-subtle': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(8px)' },
  },
  'spin-slow': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  'radar-sweep': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  'marquee-ultra-slow': {
    '0%': { transform: 'translateX(0)' },
    '100%': { transform: 'translateX(-33.33%)' },
  },
  'blueprint-in': {
    from: { opacity: '0', transform: 'scaleX(0)' },
    to: { opacity: '1', transform: 'scaleX(1)' },
  },
  'box-pop': {
    '0%': { opacity: '0', transform: 'translateY(20px) scale(0.9)' },
    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
  },
});
