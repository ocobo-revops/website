import { defineRecipe } from '@pandacss/dev';

export const button = defineRecipe({
  className: 'button',
  description: 'Button component styles',
  jsx: ['ButtonLink'],
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderRadius: 'full',
    fontWeight: 'semibold',
    letterSpacing: 'wide',
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    textDecoration: 'none',
    _focusVisible: {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineOffset: '2px',
    },
    _disabled: {
      pointerEvents: 'none',
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    '& > svg': {
      transition: 'transform 0.3s',
    },
    _hover: {
      '& > svg': {
        transform: 'translateX(0.25rem)',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'dark',
        color: 'white',
        _hover: {
          bg: 'dark/80',
        },
        _focusVisible: {
          outlineColor: 'white',
        },
      },
      solid: {
        bg: 'dark',
        color: 'white',
        _hover: {
          bg: 'dark/80',
        },
        _focusVisible: {
          outlineColor: 'white',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'dark',
        borderColor: 'dark',
        _hover: {
          bg: 'dark',
          color: 'white',
        },
        _focusVisible: {
          outlineColor: 'dark',
        },
      },
      white: {
        bg: 'white',
        color: 'dark',
        _hover: {
          bg: 'gray.100',
        },
        _focusVisible: {
          outlineColor: 'dark',
        },
      },
      cta: {
        bg: 'dark',
        color: 'white',
        shadow: 'xl',
        _hover: {
          transform: 'translateY(-0.25rem)',
          shadow: '2xl',
        },
        _focusVisible: {
          outlineColor: 'white',
        },
      },
      nav: {
        bg: 'transparent',
        color: 'currentColor',
        _hover: {
          bg: 'currentColor/10',
        },
        _focusVisible: {
          outlineColor: 'currentColor',
        },
      },
      secondary: {
        bg: 'background',
        color: 'foreground',
        borderColor: 'gray.300',
        _hover: {
          borderColor: 'foreground',
        },
        _focusVisible: {
          outlineColor: 'foreground',
        },
      },
      link: {
        bg: 'transparent',
        color: 'foreground',
        textDecoration: 'underline',
        textDecorationColor: 'gray.300',
        textUnderlineOffset: '4px',
        _hover: {
          textDecorationColor: 'currentColor',
        },
        _focusVisible: {
          outlineColor: 'foreground',
        },
      },
      yellow: {
        bg: 'ocobo.yellow',
        color: 'ocobo.dark',
        shadow: 'xl',
        _hover: {
          bg: 'ocobo.yellow/80',
          transform: 'translateY(-0.25rem)',
          shadow: '2xl',
        },
        _focusVisible: {
          outlineColor: 'ocobo.dark',
        },
      },
    },
    size: {
      sm: {
        px: '4',
        py: '2',
        fontSize: 'xs',
      },
      md: {
        px: '6',
        py: '3',
        fontSize: 'sm',
      },
      lg: {
        px: '8',
        py: '4',
        fontSize: 'base',
      },
    },
  },
  // The text link has no box: horizontal padding goes, vertical padding stays
  // so the touch target keeps its height.
  compoundVariants: [{ variant: 'link', css: { px: '0' } }],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
