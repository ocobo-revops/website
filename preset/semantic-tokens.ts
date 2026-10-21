import { defineSemanticTokens } from '@pandacss/dev';

export const semanticTokens = defineSemanticTokens({
  colors: {
    background: {
      value: {
        base: '{colors.white}',
        _dark: '{colors.dark}',
      },
    },
    foreground: {
      value: {
        base: '{colors.dark}',
        _dark: '{colors.white}',
      },
    },
    muted: {
      DEFAULT: {
        value: {
          base: '{colors.gray.light}',
          _dark: '{colors.gray}',
        },
      },
      foreground: {
        value: {
          base: '{colors.gray}',
          _dark: '{colors.gray.light}',
        },
      },
    },
    card: {
      DEFAULT: {
        value: {
          base: '{colors.white}',
          _dark: '{colors.dark}',
        },
      },
      foreground: {
        value: {
          base: '{colors.dark}',
          _dark: '{colors.gray}',
        },
      },
    },
    popover: {
      DEFAULT: {
        value: {
          base: '{colors.white}',
          _dark: '{colors.dark}',
        },
      },
      foreground: {
        value: {
          base: '{colors.dark}',
          _dark: '{colors.gray}',
        },
      },
    },
    border: {
      value: {
        base: '{colors.gray}',
        _dark: '{colors.gray}',
      },
    },
    input: {
      value: {
        base: '{colors.gray}',
        _dark: '{colors.gray}',
      },
    },
    accent: {
      DEFAULT: {
        value: {
          base: '{colors.gray.light}',
          _dark: '{colors.gray}',
        },
      },
      foreground: {
        value: {
          base: '{colors.dark}',
          _dark: '{colors.gray}',
        },
      },
    },
    destructive: {
      DEFAULT: {
        value: {
          base: '{colors.coral.light}',
          _dark: '{colors.coral.dark}',
        },
      },
      foreground: {
        value: {
          base: '{colors.coral.dark}',
          _dark: '{colors.coral.light}',
        },
      },
    },
    ring: {
      value: {
        base: '{colors.gray}',
        _dark: '{colors.gray}',
      },
    },
    // One colour per challenge (ADR 0002), keyed like the posts frontmatter.
    // DEFAULT is the accent, light the tinted background. Revenue AI also
    // uses `gradients.ai` for decoration.
    challenge: {
      rp: {
        DEFAULT: { value: '{colors.coral}' },
        light: { value: '{colors.coral.light}' },
      },
      se: {
        DEFAULT: { value: '{colors.mint}' },
        light: { value: '{colors.mint.light}' },
      },
      sc: {
        DEFAULT: { value: '{colors.yellow}' },
        light: { value: '{colors.yellow.light}' },
      },
      cx: {
        DEFAULT: { value: '{colors.sky}' },
        light: { value: '{colors.sky.light}' },
      },
      sy: {
        DEFAULT: { value: '#767676' },
        light: { value: '{colors.gray.light}' },
      },
      ai: {
        DEFAULT: { value: '{colors.coral}' },
        light: { value: '{colors.coral.light}' },
      },
    },
  },
  borders: {
    base: { value: '1px solid {colors.gray.light}' },
    input: { value: '1px solid {colors.input}' },
    destructive: { value: '1px solid {colors.destructive}' },
  },
  animations: {
    'accordion-down': { value: 'accordion-down 0.2s ease-out' },
    'accordion-up': { value: 'accordion-up 0.2s ease-out' },
  },
});
