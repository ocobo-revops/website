import { css, cx } from '@ocobo/styled-system/css';

// The dotted backdrop of the ROI sections (mockup `roi`), the same dot grid
// as the challenge pages. `overflow: clip` keeps the dots inside the section
// without turning it into a scroll box, so the sticky result card still
// sticks.
const dotBase = css({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'clip',
  _before: {
    content: '""',
    position: 'absolute',
    inset: '0',
    zIndex: -1,
    pointerEvents: 'none',
    backgroundImage:
      '[radial-gradient(rgba(33,35,35,0.11) 1px, transparent 1.2px)]',
    backgroundSize: '[22px 22px]',
  },
});

export const dotBackdrop = cx(
  dotBase,
  css({
    _before: {
      maskImage:
        '[radial-gradient(ellipse 70% 60% at 50% 60%, black, transparent)]',
    },
  }),
);

// Under the hero, densest behind the chart.
export const dotBackdropHero = cx(
  dotBase,
  css({
    _before: {
      maskImage:
        '[radial-gradient(ellipse 55% 50% at 50% 72%, black 15%, transparent 85%)]',
    },
  }),
);

export const dotBackdropTop = cx(
  dotBase,
  css({
    _before: {
      maskImage:
        '[radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent)]',
    },
  }),
);
