/**
 * Loader tests for the homepage route.
 *
 * Covers the three observable behaviors of `loader` in
 * `_main.($lang)._index.tsx`:
 *  1. EN happy path — `fetchStories('en')` returns 200 → EN testimonials emitted.
 *     Note: the loader fires the FR fallback in parallel (perf #153), so two
 *     `fetchStories` calls are expected even when EN succeeds.
 *  2. FR happy path — `fetchStories('fr')` returns 200 → testimonials emitted,
 *     no wasted fallback call.
 *  3. EN → FR fallback — both fetches fire concurrently; `fetchStories('en')`
 *     returns ≠ 200 → testimonials emitted from the FR result.
 *  4. Parallelism — both fetches register before either resolves.
 *
 * Uses the `invokeLoader` harness (`app/test/loader-harness.ts`).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ChallengeFrontmatter } from '~/modules/challenge-schema';
import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile, StoryFrontmatter } from '~/types';

const fetchStoriesMock = vi.fn();
const fetchValidChallengesMock = vi.fn();
const isPageEnabledMock = vi.fn((_slug: string) => true);
const getFixedTMock = vi.fn(
  async (lang: string, _ns?: string) => (key: string) => `${lang}:${key}`,
);

// Only fetchStories is imported from this module by the route — sync factory is
// sufficient. If a new import is added from ~/modules/content, extend this mock.
vi.mock('~/modules/content', () => ({
  fetchStories: (...args: unknown[]) => fetchStoriesMock(...args),
}));

// The home challenge cards (#241) read the challenge files.
vi.mock('~/modules/content/api', () => ({
  fetchValidChallenges: (...args: unknown[]) =>
    fetchValidChallengesMock(...args),
}));

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (lang: string, ns: string) => getFixedTMock(lang, ns),
  },
}));

vi.mock('~/modules/feature-flags', () => ({
  isPageEnabled: (slug: string) => isPageEnabledMock(slug),
}));

function storyEntry(
  overrides: Partial<StoryFrontmatter> & { slug?: string } = {},
): MarkdocFile<StoryFrontmatter> {
  const { slug = 'acme', ...frontmatterOverrides } = overrides;
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      name: 'Acme',
      date: '2024-01-01',
      title: 'Acme story',
      subtitle: 'sub',
      description: 'desc',
      speaker: 'Jane Doe',
      role: 'CRO',
      duration: '3 months',
      scopes: [],
      tools: [],
      quotes: ['Game changer'],
      deliverables: [],
      ...frontmatterOverrides,
    },
  };
}

function challengeFile(
  slug: string,
  frontmatter: Partial<ChallengeFrontmatter> = {},
): MarkdocFile<ChallengeFrontmatter> {
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      key: 'se',
      order: 1,
      name: `Name of ${slug}`,
      tagline: `Tagline of ${slug}`,
      hero: { quote: `Quote of ${slug}` },
      workstreams: {
        intro: `Intro of ${slug}`,
        items: [{ title: `First of ${slug}` }, { title: `Second of ${slug}` }],
      },
      ...frontmatter,
    } as ChallengeFrontmatter,
  } as MarkdocFile<ChallengeFrontmatter>;
}

beforeEach(() => {
  // No challenge folder yet: the state before any challenge is published.
  fetchValidChallengesMock.mockResolvedValue([404, 'not_found', undefined]);
});

afterEach(() => {
  fetchStoriesMock.mockReset();
  fetchValidChallengesMock.mockReset();
  isPageEnabledMock.mockReset();
  isPageEnabledMock.mockImplementation(() => true);
  getFixedTMock.mockClear();
});

describe('homepage loader', () => {
  it('returns testimonials and EN meta when fetchStories(en) succeeds', async () => {
    // Loader fires EN and FR in parallel (perf #153); EN result wins because
    // its status is 200, so testimonials reflect the EN entry.
    fetchStoriesMock
      .mockResolvedValueOnce([200, 'success', [storyEntry()]])
      .mockResolvedValueOnce([
        200,
        'success',
        [storyEntry({ slug: 'fr-only', quotes: ['Ignored'] })],
      ]);

    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en',
      params: { lang: 'en' },
    });

    expect(fetchStoriesMock).toHaveBeenCalledTimes(2);
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(1, 'en');
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(2, 'fr');
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('en:meta.title');
    expect(outcome.data.testimonials).toHaveLength(1);
    expect(outcome.data.testimonials[0]).toMatchObject({
      slug: 'acme',
      quote: 'Game changer',
    });
  });

  it('returns testimonials and FR meta when fetchStories(fr) succeeds', async () => {
    fetchStoriesMock.mockResolvedValueOnce([
      200,
      'success',
      [storyEntry({ slug: 'beta', quotes: ['Bouleversé'] })],
    ]);

    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr',
      params: { lang: 'fr' },
    });

    expect(fetchStoriesMock).toHaveBeenCalledExactlyOnceWith('fr');
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('fr:meta.title');
    expect(outcome.data.testimonials).toHaveLength(1);
    expect(outcome.data.testimonials[0]).toMatchObject({
      slug: 'beta',
      quote: 'Bouleversé',
    });
  });

  it('falls back to fetchStories("fr") when fetchStories(lang) returns ≠ 200', async () => {
    fetchStoriesMock
      .mockResolvedValueOnce([500, 'source_error', undefined])
      .mockResolvedValueOnce([
        200,
        'success',
        [storyEntry({ slug: 'fallback' })],
      ]);

    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en',
      params: { lang: 'en' },
    });

    expect(fetchStoriesMock).toHaveBeenCalledTimes(2);
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(1, 'en');
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(2, 'fr');
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.testimonials).toHaveLength(1);
    expect(outcome.data.testimonials[0].slug).toBe('fallback');
  });

  it('fires fetchStories(lang) and fetchStories("fr") in parallel for non-FR locales', async () => {
    // Use deferred promises so we can observe both calls fire before either
    // resolves — sequential `await fetchStories(lang); await fetchStories('fr')`
    // would only register the second call after the first settles.
    let resolveEn!: (value: [number, string, unknown]) => void;
    let resolveFr!: (value: [number, string, unknown]) => void;
    const enPromise = new Promise<[number, string, unknown]>((r) => {
      resolveEn = r;
    });
    const frPromise = new Promise<[number, string, unknown]>((r) => {
      resolveFr = r;
    });

    fetchStoriesMock
      .mockReturnValueOnce(enPromise)
      .mockReturnValueOnce(frPromise);

    const { loader } = await import('./_main.($lang)._index');
    const loaderPromise = invokeLoader(loader, {
      url: 'http://test.local/en',
      params: { lang: 'en' },
    });

    // Let the loader run through its async setup (redirectWithLocale + getFixedT)
    // before checking mock calls. setTimeout(0) = macrotask, cross-env safe.
    await new Promise((r) => setTimeout(r, 0));

    expect(fetchStoriesMock).toHaveBeenCalledTimes(2);
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(1, 'en');
    expect(fetchStoriesMock).toHaveBeenNthCalledWith(2, 'fr');

    resolveEn([200, 'success', [storyEntry()]]);
    resolveFr([200, 'success', [storyEntry({ slug: 'fr-only' })]]);
    await loaderPromise;
  });

  it('does not fall back when fetchStories("fr") returns ≠ 200 (no infinite retry)', async () => {
    fetchStoriesMock.mockResolvedValueOnce([500, 'source_error', undefined]);

    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr',
      params: { lang: 'fr' },
    });

    expect(fetchStoriesMock).toHaveBeenCalledExactlyOnceWith('fr');
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.testimonials).toEqual([]);
  });

  it('fires getFixedT in parallel with fetchStories calls', async () => {
    // getFixedT and fetchStories are independent — they must start concurrently.
    // If sequential, fetchStories would only be called after getFixedT resolves.
    let resolveT!: (fn: (key: string) => string) => void;
    const tPromise = new Promise<(key: string) => string>((r) => {
      resolveT = r;
    });

    getFixedTMock.mockImplementationOnce(() => tPromise);
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./_main.($lang)._index');
    const loaderPromise = invokeLoader(loader, {
      url: 'http://test.local/fr',
      params: { lang: 'fr' },
    });

    await new Promise((r) => setImmediate(r));

    // fetchStories must have fired even though getFixedT has not resolved yet.
    expect(fetchStoriesMock).toHaveBeenCalledTimes(1);

    resolveT((key: string) => `fr:${key}`);
    await loaderPromise;
  });
});

describe('homepage loader: challenge cards (#241)', () => {
  async function loadHome(lang: 'fr' | 'en' = 'fr') {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: `http://test.local/${lang}`,
      params: { lang },
    });
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') throw new Error('expected data');
    return outcome.data;
  }

  it('returns every published challenge of the language, in order', async () => {
    fetchValidChallengesMock.mockResolvedValueOnce([
      200,
      'success',
      [
        challengeFile('revenue-ai', { key: 'ai', order: 6 }),
        challengeFile('sales-experience', { key: 'se', order: 1 }),
        challengeFile('customer-experience', { key: 'cx', order: 2 }),
      ],
    ]);

    const data = await loadHome('en');

    expect(fetchValidChallengesMock).toHaveBeenCalledExactlyOnceWith('en');
    expect(data.challenges.map(({ slug }) => slug)).toEqual([
      'sales-experience',
      'customer-experience',
      'revenue-ai',
    ]);
  });

  it('gives each card the quote, workstream intro and workstream titles of its file', async () => {
    fetchValidChallengesMock.mockResolvedValueOnce([
      200,
      'success',
      [challengeFile('sales-experience', { key: 'se', order: 1 })],
    ]);

    const data = await loadHome();

    expect(data.challenges).toEqual([
      {
        slug: 'sales-experience',
        key: 'se',
        order: 1,
        name: 'Name of sales-experience',
        tagline: 'Tagline of sales-experience',
        quote: 'Quote of sales-experience',
        intro: 'Intro of sales-experience',
        workstreams: [
          'First of sales-experience',
          'Second of sales-experience',
        ],
      },
    ]);
  });

  it('returns only published challenges: a slug the challenge route rejects is left out', async () => {
    fetchValidChallengesMock.mockResolvedValueOnce([
      200,
      'success',
      [challengeFile('sales-experience'), challengeFile('Draft_Copy')],
    ]);

    const data = await loadHome();

    expect(data.challenges.map(({ slug }) => slug)).toEqual([
      'sales-experience',
    ]);
  });

  it('returns no challenge, and fetches none, while the challenge pages are disabled', async () => {
    isPageEnabledMock.mockImplementation((slug) => slug !== 'challenges');

    const data = await loadHome();

    expect(fetchValidChallengesMock).not.toHaveBeenCalled();
    expect(data.challenges).toEqual([]);
  });

  it('still renders the home, with no challenge, when the list fails', async () => {
    fetchValidChallengesMock.mockResolvedValueOnce([
      500,
      'source_error',
      undefined,
    ]);

    const data = await loadHome();

    expect(data.challenges).toEqual([]);
  });

  it('still renders the home, with no challenge, when the list throws', async () => {
    fetchValidChallengesMock.mockRejectedValueOnce(new Error('network'));

    const data = await loadHome();

    expect(data.challenges).toEqual([]);
  });
});
