/**
 * Menu entries of the navbar challenge entry (#237).
 */

import { describe, expect, it } from 'vitest';

import type { MarkdocFile } from '~/types';

import {
  didMainChallengeLoadFail,
  otherChallenges,
  toChallengeMenu,
} from './challenge-menu';
import type { ChallengeFrontmatter } from './challenge-schema';

function challengeFile(
  slug: string,
  frontmatter: Partial<ChallengeFrontmatter>,
): MarkdocFile<ChallengeFrontmatter> {
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      key: 'rp',
      name: slug,
      tagline: `Tagline of ${slug}`,
      order: 1,
      ...frontmatter,
    } as ChallengeFrontmatter,
  } as MarkdocFile<ChallengeFrontmatter>;
}

describe('toChallengeMenu', () => {
  it('sorts the entries by order', () => {
    const menu = toChallengeMenu([
      challengeFile('revenue-ai', { order: 3 }),
      challengeFile('sales-experience', { order: 1 }),
      challengeFile('revenue-systems', { order: 2 }),
    ]);

    expect(menu.map(({ slug }) => slug)).toEqual([
      'sales-experience',
      'revenue-systems',
      'revenue-ai',
    ]);
  });

  it('orders two entries with the same order by slug', () => {
    const menu = toChallengeMenu([
      challengeFile('sales-experience', { order: 1 }),
      challengeFile('revenue-systems', { order: 1 }),
    ]);

    expect(menu.map(({ slug }) => slug)).toEqual([
      'revenue-systems',
      'sales-experience',
    ]);
  });

  it('drops a slug the challenge route answers 404 to', () => {
    const menu = toChallengeMenu([
      challengeFile('Not_Kebab', {}),
      challengeFile('revenue-ai', {}),
    ]);

    expect(menu.map(({ slug }) => slug)).toEqual(['revenue-ai']);
  });

  it('keeps only the fields the menu shows, and nulls a placeholder tagline', () => {
    const [entry] = toChallengeMenu([
      challengeFile('revenue-ai', {
        key: 'ai',
        name: 'Revenue AI',
        tagline: '[Tagline à écrire]',
      }),
    ]);

    expect(entry).toEqual({
      slug: 'revenue-ai',
      key: 'ai',
      name: 'Revenue AI',
      tagline: null,
    });
  });
});

describe('didMainChallengeLoadFail', () => {
  it('is true only when the layout loader reports a failed load', () => {
    expect(
      didMainChallengeLoadFail({
        'routes/_main': { challenges: [], failed: true },
      }),
    ).toBe(true);
    expect(
      didMainChallengeLoadFail({
        'routes/_main': { challenges: [], failed: false },
      }),
    ).toBe(false);
    // Routes outside `_main`, or a `_main` loader that threw.
    expect(didMainChallengeLoadFail({ root: {} })).toBe(false);
    expect(didMainChallengeLoadFail({ 'routes/_main': null })).toBe(false);
  });
});

describe('otherChallenges', () => {
  it('drops the current challenge and keeps the menu order', () => {
    const menu = toChallengeMenu([
      challengeFile('revenue-ai', { key: 'ai', order: 6 }),
      challengeFile('revenue-performance', { order: 1 }),
      challengeFile('sales-experience', { key: 'se', order: 2 }),
    ]);
    expect(
      otherChallenges(menu, 'revenue-performance').map(({ slug }) => slug),
    ).toEqual(['sales-experience', 'revenue-ai']);
  });
});
