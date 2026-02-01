import { definePattern } from '@pandacss/dev';

export const carousel = definePattern({
  description: 'A container that allows for horizontal carousel',
  defaultValues: {
    hideScrollbar: true,
  },
  properties: {
    // Whether to hide the scrollbar
    hideScrollbar: { type: 'boolean' },
  },
  // disallow the properties (in TypeScript)
  blocklist: ['overflow', 'scrollbarWidth', 'WebkitOverflowScrolling'],
  transform(props) {
    const { hideScrollbar, ...rest } = props;
    return {
      overflow: 'auto',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      scrollSnapType: 'x mandatory',
      scrollbarWidth: hideScrollbar ? 'none' : 'auto',
      WebkitOverflowScrolling: 'touch',
      '&::-webkit-scrollbar': {
        display: hideScrollbar ? 'none' : 'block',
      },
      ...rest,
    };
  },
});
