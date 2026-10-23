import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import type { ChallengeKey } from '~/modules/challenge-schema';

import { challengeFill } from './challenge-palette';

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

/** Section label in the challenge colour, as in the prototype. */
export const challengePill: Record<ChallengeKey, string> = {
  rp: cx(pillBase, challengeFill.rp),
  se: cx(pillBase, challengeFill.se),
  sc: cx(pillBase, challengeFill.sc),
  cx: cx(pillBase, challengeFill.cx),
  sy: cx(pillBase, challengeFill.sy),
  ai: cx(pillBase, challengeFill.ai),
};
