import { defineSlotRecipe } from '@pandacss/dev';

export const select = defineSlotRecipe({
  className: 'select',
  description: 'Styles for the Select component',
  slots: [
    'root',
    'group',
    'value',
    'trigger',
    'viewport',
    'content',
    'label',
    'item',
    'itemIndicator',
    'separator',
  ],
  base: {
    trigger: {
      display: 'flex',
      h: 'input',
      w: 'full',
      // Note: maxWidth can be overridden via className prop if needed
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'thin',
      borderColor: 'gray.light',
      bg: 'white',
      px: '3',
      py: '2',
      gap: '2',
      cursor: 'pointer',
      focusRingOffsetColor: 'background',
      transition: 'colors',

      _placeholder: {
        color: 'muted',
      },

      _hover: {
        borderColor: 'gray',
      },

      _focusVisible: {
        outline: 'none',
        borderColor: 'gray',
      },

      _disabled: {
        cursor: 'not-allowed',
        opacity: '0.5',
      },

      '&[data-state=open]': {
        borderColor: 'gray',
      },
    },
    viewport: {
      p: '1',

      '&[data-position=popper]': {
        // Ark UI uses anchor positioning, no CSS variables needed
        w: 'full',
      },
    },
    content: {
      position: 'relative',
      zIndex: 50,
      minW: 'var(--reference-width)', // Ark UI provides trigger width
      overflow: 'hidden',
      border: 'thin',
      borderColor: 'gray.light',
      color: 'popover.foreground',
      backgroundColor: 'popover',
      shadow: 'base',
      borderRadius: 'none',

      '&[data-state=open]': {
        animateIn: true,
        fadeIn: 0,
        zoomIn: 95,
      },

      '&[data-state=closed]': {
        animateOut: true,
        fadeOut: 0,
        zoomOut: 95,
      },

      '&[data-side=top]': {
        slideInFromBottom: '2',
      },

      '&[data-side=bottom]': {
        slideInFromTop: '2',
      },

      '&[data-side=left]': {
        slideInFromRight: '2',
      },

      '&[data-side=right]': {
        slideInFromLeft: '2',
      },

      '&[data-position=popper]': {
        '&[data-side=top]': {
          translateY: '-1',
        },

        '&[data-side=bottom]': {
          translateY: '1',
        },

        '&[data-side=left]': {
          translateX: '-1',
        },

        '&[data-side=right]': {
          translateX: '1',
        },
      },
    },
    label: {
      py: '1.5',
      pl: '8',
      pr: '2',
      fontWeight: 'bold',
    },
    item: {
      position: 'relative',
      display: 'flex',
      cursor: 'pointer',
      userSelect: 'none',
      alignItems: 'center',
      py: '1.5',
      pl: '8',
      pr: '2',
      outline: '2px solid transparent',
      transition: 'colors',

      _hover: {
        bg: 'gray.light',
        color: 'dark',
      },

      _focus: {
        bg: 'gray.light',
        color: 'dark',
      },

      // Ark UI uses data-highlighted for keyboard/mouse hover
      '&[data-highlighted]': {
        bg: 'gray.light',
        color: 'dark',
      },

      // Ark UI uses data-selected for selected items
      '&[data-selected]': {
        bg: 'gray.light',
        color: 'dark',
        fontWeight: 'semibold',
      },

      ['&[data-disabled]']: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
    itemIndicator: {
      position: 'absolute',
      left: '2',
      display: 'flex',
      h: '3.5',
      w: '3.5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    separator: {
      mx: '-1',
      my: '1',
      h: '1px',
      bg: 'muted',
    },
  },
});
