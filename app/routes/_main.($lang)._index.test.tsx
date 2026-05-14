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

import { afterEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile, StoryFrontmatter } from '~/types';

const fetchStoriesMock = vi.fn();
const getFixedTMock = vi.fn(
  async (lang: string, _ns?: string) => (key: string) => `${lang}:${key}`,
);

vi.mock('~/modules/content', () => ({
  fetchStories: (...args: unknown[]) => fetchStoriesMock(...args),
}));

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (lang: string, ns: string) => getFixedTMock(lang, ns),
  },
}));

vi.mock('~/modules/feature-flags', () => ({
  isPageEnabled: () => true,
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

afterEach(() => {
  fetchStoriesMock.mockReset();
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

    // Let the loader run up to its first await point.
    await new Promise((r) => setImmediate(r));

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
