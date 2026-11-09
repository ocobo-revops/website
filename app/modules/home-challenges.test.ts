/**
 * Home challenge cards (#241): what each card reads from the challenge file.
 */

import { describe, expect, it } from 'vitest';

import type { MarkdocFile } from '~/types';

import type { ChallengeFrontmatter } from './challenge-schema';
import { challengeNumber, toHomeChallengeCards } from './home-challenges';

type FileOverrides = {
  order?: number;
  tagline?: string;
  quote?: string;
  intro?: string;
  workstreams?: string[];
};

function challengeFile(
  slug: string,
  {
    order = 1,
    tagline = 'Une organisation qui grandit',
    quote = 'Deux commerciaux font le chiffre.',
    intro = 'Six chantiers.',
    workstreams = ['Des leads ciblés'],
  }: FileOverrides = {},
): MarkdocFile<ChallengeFrontmatter> {
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      key: 'se',
      name: 'Sales Experience',
      order,
      tagline,
      hero: { quote },
      workstreams: {
        intro,
        items: workstreams.map((title) => ({ title })),
      },
    } as unknown as ChallengeFrontmatter,
  } as MarkdocFile<ChallengeFrontmatter>;
}

describe('toHomeChallengeCards', () => {
  it('reads the card fields from the file', () => {
    expect(toHomeChallengeCards([challengeFile('sales-experience')])).toEqual([
      {
        slug: 'sales-experience',
        key: 'se',
        order: 1,
        name: 'Sales Experience',
        tagline: 'Une organisation qui grandit',
        quote: 'Deux commerciaux font le chiffre.',
        intro: 'Six chantiers.',
        workstreams: ['Des leads ciblés'],
      },
    ]);
  });

  it('gives null for a tagline, quote or intro holding a placeholder', () => {
    const [card] = toHomeChallengeCards([
      challengeFile('sales-experience', {
        tagline: '[Tagline]',
        quote: '[Citation client]',
        intro: '[Intro]',
      }),
    ]);

    expect(card).toMatchObject({ tagline: null, quote: null, intro: null });
  });

  it('leaves out the workstream titles holding a placeholder', () => {
    const [card] = toHomeChallengeCards([
      challengeFile('sales-experience', {
        workstreams: ['Des leads ciblés', '[Chantier 2]'],
      }),
    ]);

    expect(card.workstreams).toEqual(['Des leads ciblés']);
  });

  it('orders two cards with the same order by slug', () => {
    const cards = toHomeChallengeCards([
      challengeFile('sales-experience', { order: 1 }),
      challengeFile('revenue-systems', { order: 1 }),
    ]);

    expect(cards.map(({ slug }) => slug)).toEqual([
      'revenue-systems',
      'sales-experience',
    ]);
  });
});

describe('challengeNumber', () => {
  it('pads the order to two digits', () => {
    expect(challengeNumber(1)).toBe('01');
    expect(challengeNumber(12)).toBe('12');
  });
});
