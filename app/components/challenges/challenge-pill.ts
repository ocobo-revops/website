import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { ChallengeKey } from '~/modules/challenge-schema';

const pillBase = cx(
  text({ variant: 'label' }),
  css({
    // Its own width in a stretching column as in a centred row.
    w: 'fit',
    px: '4',
    py: '1.5',
    rounded: 'full',
  }),
);

/**
 * Section label in the challenge colour, as in the prototype. One static
 * class per challenge: the Revenue Systems grey needs white text to reach
 * 4.5:1, and AI content takes the AI gradient.
 */
export const challengePill: Record<ChallengeKey, string> = {
  rp: cx(pillBase, css({ bg: 'challenge.rp', color: 'dark' })),
  se: cx(pillBase, css({ bg: 'challenge.se', color: 'dark' })),
  sc: cx(pillBase, css({ bg: 'challenge.sc', color: 'dark' })),
  cx: cx(pillBase, css({ bg: 'challenge.cx', color: 'dark' })),
  sy: cx(pillBase, css({ bg: 'challenge.sy', color: 'white' })),
  ai: cx(pillBase, css({ bgGradient: 'ai', color: 'dark' })),
};
