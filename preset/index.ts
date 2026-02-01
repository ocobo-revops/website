import { definePreset } from '@pandacss/dev';
import pandaPreset from '@pandacss/preset-panda';

import { breakpoints } from './breakpoints';
import { conditions } from './conditions';
import { globalCss } from './global-css';
import { globalVars } from './global-vars';
import { keyframes } from './keyframes';
import { layerStyles } from './layer-styles';
import { patterns } from './patterns';
import { recipes } from './recipes';
import { semanticTokens } from './semantic-tokens';
import { slotRecipes } from './slot-recipes';
import { textStyles } from './text-styles';
import { tokens } from './tokens';
import { utilities } from './utilities';

export default definePreset({
  name: 'ocobo-preset',
  presets: [pandaPreset],
  globalVars,
  globalCss,
  conditions,
  utilities,
  patterns,
  theme: {
    extend: {
      tokens,
      semanticTokens,
      breakpoints,
      textStyles,
      keyframes,
      recipes,
      slotRecipes,
      layerStyles,
    },
  },
});
