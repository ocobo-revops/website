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
  it('maps a complete challenge to its sections', () => {
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
    expect(page.workstreams?.items).toHaveLength(4);
    expect(page.method?.steps).toHaveLength(3);
    expect(page.method?.tools).toEqual([
      'hubspot',
      'salesforce',
      'modjo',
      'notion',
    ]);
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

  describe('workstreams', () => {
    it('leaves the heading to the locale when the file has none', () => {
      const page = buildChallengePage(loadFrontmatter());

      expect(page.workstreams?.title).toBeNull();
      expect(page.workstreams?.items[0]).toMatchObject({
        category: 'Process and tech',
        title: 'A pipeline that means the same thing to everyone',
        note: null,
      });
    });

    it("keeps the file's heading and notes when present", () => {
      const { frontmatter } = loadChallengeFixture('fr', 'revenue-ai');
      const page = buildChallengePage(frontmatter);

      expect(page.workstreams?.title).toBe(
        "Six cas d'usage Revenue, prêts à déployer",
      );
      expect(page.workstreams?.items).toHaveLength(6);
      expect(page.workstreams?.items[0].note).toBe(
        'Prérequis : un ICP explicite et un CRM qui sert de référence.',
      );
    });

    it('keeps the step number when the file sets one', () => {
      const { frontmatter } = loadChallengeFixture('fr', 'sales-compensation');
      const page = buildChallengePage(frontmatter);

      expect(page.workstreams?.items.map((item) => item.step)).toEqual([
        1, 2, 3, 4, 5,
      ]);
    });

    it('drops a card whose title or deliverable is a placeholder', () => {
      const frontmatter = loadFrontmatter();
      const [first, second, ...rest] = frontmatter.workstreams.items;
      const page = buildChallengePage({
        ...frontmatter,
        workstreams: {
          ...frontmatter.workstreams,
          items: [
            { ...first, title: '[Title]' },
            { ...second, deliverable: '[Deliverable]' },
            ...rest,
          ],
        },
      });

      expect(page.workstreams?.items.map((item) => item.title)).toEqual(
        rest.map((item) => item.title),
      );
    });

    it('hides the section when every card is a placeholder', () => {
      const frontmatter = loadFrontmatter();
      const page = buildChallengePage({
        ...frontmatter,
        workstreams: {
          ...frontmatter.workstreams,
          items: frontmatter.workstreams.items.map((item) => ({
            ...item,
            deliverable: '[Deliverable]',
          })),
        },
      });

      expect(page.workstreams).toBeNull();
    });

    it('treats a placeholder heading override as absent', () => {
      const frontmatter = loadFrontmatter();
      const page = buildChallengePage({
        ...frontmatter,
        workstreams: { ...frontmatter.workstreams, title: '[Title]' },
      });

      expect(page.workstreams?.title).toBeNull();
    });
  });

  describe('method', () => {
    it('leaves the heading and step titles to the locale by default', () => {
      const page = buildChallengePage(loadFrontmatter());

      expect(page.method?.title).toBeNull();
      expect(page.method?.steps.map((step) => step.title)).toEqual([
        null,
        null,
        null,
      ]);
    });

    it("keeps the file's heading and step titles when present", () => {
      const { frontmatter } = loadChallengeFixture('fr', 'revenue-ai');
      const page = buildChallengePage(frontmatter);

      expect(page.method?.title).toBe('Le Revenue AI Sprint');
      expect(page.method?.steps.map((step) => step.title)).toEqual([
        'Vérifier les fondations',
        'Prouver sur un cas réel',
        'Décider la suite',
      ]);
    });

    it('keeps every step in place when one text is a placeholder', () => {
      const frontmatter = loadFrontmatter();
      const [first, ...rest] = frontmatter.method.steps;
      const page = buildChallengePage({
        ...frontmatter,
        method: {
          ...frontmatter.method,
          steps: [{ ...first, text: '[Text]' }, ...rest],
        },
      });

      expect(page.method?.steps).toHaveLength(3);
      expect(page.method?.steps[0].text).toBeNull();
      expect(page.method?.steps[1].text).toBe(rest[0].text);
    });

    it('hides the section when every step text is a placeholder', () => {
      const frontmatter = loadFrontmatter();
      const page = buildChallengePage({
        ...frontmatter,
        method: {
          ...frontmatter.method,
          steps: frontmatter.method.steps.map((step) => ({
            ...step,
            text: '[Text]',
          })),
        },
      });

      expect(page.method).toBeNull();
    });

    it('drops placeholder tools and a placeholder note', () => {
      const frontmatter = loadFrontmatter();
      const page = buildChallengePage({
        ...frontmatter,
        method: {
          ...frontmatter.method,
          tools: ['[Tool]', 'hubspot'],
          note: '[Note]',
        },
      });

      expect(page.method).toMatchObject({ tools: ['hubspot'], note: null });
    });
  });
});
