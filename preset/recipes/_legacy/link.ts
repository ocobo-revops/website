import { defineRecipe } from '@pandacss/dev';

export const link = defineRecipe({
  className: 'link',
  description:
    'A link is a reference to a web resource that can be clicked on to navigate to it.',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'start',
    fontWeight: '700',
    textDecoration: 'none',
    cursor: 'pointer',
    flexWrap: 'wrap',
    color: 'inherit',
    gap: '2',
    position: 'relative',
    pb: '2px',

    _before: {
      content: '""',
      display: 'inline-block',
      background: 'foreground',
      height: '[2px]',
      width: '[calc(100% - 40px)]',
      transition: 'all',
      position: 'absolute',
      bottom: 0,
    },

    _after: {
      content: '""',
      width: '[28px]',
      height: '[9px]',
      display: 'inline-block',
      position: 'relative',
      zIndex: '0',
      bg: 'currentColor',
      maskImage: `url("data:image/svg+xml,%3Csvg width='28' height='9' viewBox='0 0 28 9' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M27.3535 4.68388C27.5488 4.48862 27.5488 4.17204 27.3535 3.97678L24.1715 0.794796C23.9763 0.599534 23.6597 0.599534 23.4644 0.794796C23.2692 0.990058 23.2692 1.30664 23.4644 1.5019L26.2928 4.33033L23.4644 7.15876C23.2692 7.35402 23.2692 7.6706 23.4644 7.86586C23.6597 8.06113 23.9763 8.06113 24.1715 7.86586L27.3535 4.68388ZM0.473633 4.83033L27 4.83033V3.83033L0.473633 3.83033L0.473633 4.83033Z'/%3E%3C/svg%3E%0A")`,
    },

    _hover: {
      _before: {
        width: 'full',
      },
    },

    _focusVisible: {
      outline: 'none',
      _before: {
        height: '[4px]',
      },
    },

    '& svg': { marginLeft: '2' },
  },
});
