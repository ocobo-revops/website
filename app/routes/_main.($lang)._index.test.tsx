/**
 * Loader tests for the homepage route.
 *
 * Covers the three observable behaviors of `loader` in
 * `_main.($lang)._index.tsx`:
 *  1. EN happy path — `fetchStories('en')` returns 200 → testimonials emitted.
 *  2. FR happy path — `fetchStories('fr')` returns 200 → testimonials emitted.
 *  3. EN → FR fallback — `fetchStories('en')` returns ≠ 200, `fetchStories('fr')`
 *     returns 200 → testimonials still emitted from the FR result.
 *
 * Uses the `invokeLoader` harness (`app/test/loader-harness.ts`).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile, StoryFrontmatter } from '~/types';

const fetchStoriesMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchStories: (...args: unknown[]) => fetchStoriesMock(...args),
}));

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: async (lang: string) => (key: string) => `${lang}:${key}`,
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
});

describe('homepage loader', () => {
  it('returns testimonials and EN meta when fetchStories(en) succeeds', async () => {
    fetchStoriesMock.mockResolvedValueOnce([200, 'success', [storyEntry()]]);

    const { loader } = await import('./_main.($lang)._index');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en',
      params: { lang: 'en' },
    });

    expect(fetchStoriesMock).toHaveBeenCalledExactlyOnceWith('en');
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
});
