import { defineSlotRecipe } from '@pandacss/dev';

export const accordion = defineSlotRecipe({
  className: 'accordion',
  description: 'Styles for the Accordion component',
  slots: ['root', 'item', 'header', 'trigger', 'content'],
  base: {
    item: {
      // Handle chevron rotation when item has data-state
      '&[data-state=open] svg': {
        transform: 'rotate(90deg)',
      },
    },
    header: {
      display: 'flex',
      width: '100%',
    },
    trigger: {
      display: 'flex',
      flex: '1',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all',
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      width: '100%', // Ensure full width

      _hover: {},

      '& > svg': {
        flexShrink: '0',
        transition: 'transform',
        transitionDuration: 'normal',
        marginLeft: 'auto', // Push chevron to the right
      },

      // Ark UI puts data-state on trigger
      '&[data-state=open] > svg': {
        transform: 'rotate(90deg)',
      },

      // Also handle if data-state is on parent item
      '[data-state=open] &[data-state=open] > svg': {
        transform: 'rotate(90deg)',
      },

      // Handle Ark UI data-expanded attribute
      '&[data-expanded] > svg': {
        transform: 'rotate(90deg)',
      },
    },
    content: {
      overflow: 'hidden',

      '&[data-state=closed]': {
        animation: 'accordion-up 200ms ease-out',
      },

      '&[data-state=open]': {
        animation: 'accordion-down 200ms ease-out',
      },
    },
  },
});
