import { defineRecipe } from '@pandacss/dev';

export const button = defineRecipe({
  className: 'button',
  description:
    'A button is a clickable element that triggers an action or a state change.',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    rounded: 'full',
    fontWeight: '700',
    transition: 'colors',
    cursor: 'pointer',
    border: 'thin',
    height: { base: '44px', '2xl': '50px' },
    px: '4',
    gap: '2',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontSize: 'medium',

    _focusVisible: {
      outline: 'none',
    },

    _disabled: {
      pointerEvents: 'none',
      bg: 'muted',
      color: 'muted.foreground',
      cursor: 'not-allowed',
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
  },
  variants: {
    variant: {
      outline: {
        background: 'transparent',
        color: 'foreground',
        borderColor: 'foreground',

        _hover: {
          background: 'foreground',
          color: 'background',
        },
        _focusVisible: {
          background:
            'linear-gradient(75.89deg, #000000 50.27%, #687070 80.21%, #D4D1D1 91.56%)',
          color: 'background',
        },
        _disabled: {
          background: 'gray.light',
          borderColor: 'gray.light',
          color: 'gray',
        },
        _dark: {
          _focusVisible: {
            background:
              'linear-gradient(75.89deg, #FFFFFF 50.27%, #F3EFEF 66.17%, #D4D1D1 91.56%);',
          },
          _disabled: {
            background: 'transparent',
            borderColor: 'gray',
            color: 'gray',
          },
        },
      },
      solid: {
        background: 'foreground',
        color: 'background',
        borderColor: 'foreground',

        _hover: {
          background: 'background',
          color: 'foreground',
        },
        _focusVisible: {
          background:
            'linear-gradient(75.89deg, #FFFFFF 50.27%, #F3EFEF 66.17%, #D4D1D1 91.56%);',
          color: 'dark',
        },
        _disabled: {
          background: 'gray',
          borderColor: 'gray',
          color: 'white',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});
