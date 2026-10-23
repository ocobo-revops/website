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

/**
 * Solid challenge fill with readable text: pills, expert labels, person card
 * backs. The Revenue Systems grey needs white text to reach 4.5:1. Revenue
 * AI fills with coral, the start of its gradient (ADR 0002).
 */
export const challengeFill: Record<ChallengeKey, string> = {
  rp: css({ bg: 'challenge.rp', color: 'dark' }),
  se: css({ bg: 'challenge.se', color: 'dark' }),
  sc: css({ bg: 'challenge.sc', color: 'dark' }),
  cx: css({ bg: 'challenge.cx', color: 'dark' }),
  sy: css({ bg: 'challenge.sy', color: 'white' }),
  ai: css({ bg: 'challenge.ai', color: 'dark' }),
};
