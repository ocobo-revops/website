import { describe, expect, it } from 'vitest';

import { headlineAccent } from '~/components/ui/headline-accent';

import { challengeHeadlineAccent } from './challenge-palette';

describe('challengeHeadlineAccent', () => {
  it('gives Revenue AI the gradient and every other challenge a solid colour', () => {
    expect(challengeHeadlineAccent).toEqual({
      rp: headlineAccent.coral,
      se: headlineAccent.mint,
      sc: headlineAccent.yellow,
      cx: headlineAccent.sky,
      sy: headlineAccent.gray,
      ai: headlineAccent.ai,
    });
  });

  it('sets italic on every tone, and gradient text on AI only', () => {
    for (const [key, className] of Object.entries(challengeHeadlineAccent)) {
      // Class names depend on Panda's shorthand setting: match the value.
      expect(className).toMatch(/italic/);
      expect(className.includes('headlineAccent.ai')).toBe(key === 'ai');
    }
  });
});
