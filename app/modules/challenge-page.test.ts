// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { loadChallengeFixture } from '~/test/challenge-fixture';

import {
  buildChallengePage,
  isChallengeSlug,
  isPlaceholder,
} from './challenge-page';

const loadFrontmatter = () =>
  loadChallengeFixture('en', 'revenue-performance').frontmatter;

describe('isPlaceholder', () => {
  it.each(['[À compléter]', '  [TBD]  ', '[]'])('flags %j', (value) => {
    expect(isPlaceholder(value)).toBe(true);
  });

  it.each(['A number', 'See [1] here', '[a] and [b'])('keeps %j', (value) => {
    expect(isPlaceholder(value)).toBe(false);
  });
});

describe('isChallengeSlug', () => {
  it.each(['revenue-performance', 'ai', 'revenue-ai-2'])(
    'accepts %j',
    (slug) => {
      expect(isChallengeSlug(slug)).toBe(true);
    },
  );

  it.each(['', 'Revenue', '../members', 'a--b', '-a', 'a b', 'a/b'])(
    'rejects %j',
    (slug) => {
      expect(isChallengeSlug(slug)).toBe(false);
    },
  );
});

describe('buildChallengePage', () => {
  it('maps a complete challenge to its four sections', () => {
    const page = buildChallengePage(loadFrontmatter());

    expect(page.key).toBe('rp');
    expect(page.order).toBe(3);
    expect(page.hero).toMatchObject({
      title: 'A number',
      titleMuted: 'you can see coming.',
      cta: 'Make my forecast reliable',
      activeStages: ['discovery', 'negotiation', 'closing', 'expansion'],
    });
    expect(page.symptoms?.items).toHaveLength(5);
    expect(page.audience).toHaveLength(4);
    expect(page.diagnostic?.cta).toBe('Make my forecast reliable');
  });

  it('drops placeholder list items and keeps the section', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      symptoms: {
        ...frontmatter.symptoms,
        items: ['[Symptom]', ...frontmatter.symptoms.items.slice(1)],
      },
    });

    expect(page.symptoms?.items).toEqual(frontmatter.symptoms.items.slice(1));
  });

  it('hides symptoms when every item is a placeholder', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      symptoms: {
        ...frontmatter.symptoms,
        items: frontmatter.symptoms.items.map(() => '[Symptom]'),
      },
    });

    expect(page.symptoms).toBeNull();
  });

  it('hides audience when every role is a placeholder', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      audience: frontmatter.audience.map((entry) => ({
        ...entry,
        roles: '[Roles]',
      })),
    });

    expect(page.audience).toBeNull();
  });

  it('hides a section whose title is a placeholder', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      symptoms: { ...frontmatter.symptoms, title: ['[Title]', 'second line'] },
      diagnostic: { ...frontmatter.diagnostic, question: '[Question]' },
    });

    expect(page.symptoms).toBeNull();
    expect(page.diagnostic).toBeNull();
  });

  it('falls back on the challenge name for a placeholder hero title', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      hero: { ...frontmatter.hero, title: ['[Title]', 'second line'] },
    });

    expect(page.hero).toMatchObject({
      title: frontmatter.name,
      titleMuted: null,
    });
  });

  it('nulls an optional placeholder field and keeps its section', () => {
    const frontmatter = loadFrontmatter();
    const page = buildChallengePage({
      ...frontmatter,
      hero: { ...frontmatter.hero, quote: '[Quote]', cta: '[CTA]' },
      bowtie: { ...frontmatter.bowtie, caption: '[Caption]' },
    });

    expect(page.hero).toMatchObject({ quote: null, cta: null, caption: null });
    expect(page.diagnostic?.cta).toBeNull();
  });
});
