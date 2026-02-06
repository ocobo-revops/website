import { defineConfig } from '@pandacss/dev';

import ocoboPreset from 'preset';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  jsxFramework: 'react',
  presets: [ocoboPreset],

  // Where to look for your css declarations
  include: [
    './app/routes/**/*.{ts,tsx,js,jsx}',
    './app/components/**/*.{ts,tsx,js,jsx}',
  ],

  // Files to exclude
  exclude: [],
  strictPropertyValues: true,
  strictTokens: false,

  // Useful for theme customization
  theme: {
    extend: {},
  },

  staticCss: {
    css: [
      {
        properties: {
          // ✅ Good: Pre-generate the styles for the color
          color: ['yellow', 'sky', 'mint', 'coral'],
          borderColor: ['yellow', 'sky', 'mint', 'coral'],
          backgroundColor: [
            'yellow',
            'sky',
            'mint',
            'coral',
            'yellow.light',
            'sky.light',
            'mint.light',
            'coral.light',
          ],
        },
      },
    ],
    recipes: {
      section: [{ bg: ['*'], padding: ['*'] }],
    },
  },

  // The output directory for your css system
  outdir: '@ocobo/styled-system',
});
