import { css } from '@ocobo/styled-system/css';

import type { ChallengeKey } from '~/modules/challenge-schema';

/**
 * Sets `colorPalette` to the challenge colour, so that children read it as
 * `colorPalette` and `colorPalette.light`. One static class per challenge:
 * Panda only ships literal values (CLAUDE.md, static analysis trap).
 */
export const challengePalette: Record<ChallengeKey, string> = {
  rp: css({ colorPalette: 'challenge.rp' }),
  se: css({ colorPalette: 'challenge.se' }),
  sc: css({ colorPalette: 'challenge.sc' }),
  cx: css({ colorPalette: 'challenge.cx' }),
  sy: css({ colorPalette: 'challenge.sy' }),
  ai: css({ colorPalette: 'challenge.ai' }),
};
