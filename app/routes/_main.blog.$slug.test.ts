/**
 * Loader tests for the blog detail route.
 *
 * Covers the observable behaviours of `loader` in `_main.blog.$slug.tsx`:
 *  1. 404 when slug is missing from params
 *  2. 404 when `fetchBlogpost` returns a non-200 status
 *  3. Happy path: article, toc, intro, and author returned
 *  4. `intro` comes from `frontmatter.exerpt` when set (extractFirstParagraph not called)
 *  5. `intro` falls back to `extractFirstParagraph` when no exerpt
 *  6. `fetchBlogpost` is called with the correct lang (EN variant)
 *
 * Uses the `invokeLoader` harness (`app/test/loader-harness.ts`).
 */

import type { RenderableTreeNode } from '@markdoc/markdoc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { BlogpostFrontmatter } from '~/modules/schemas';
import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile } from '~/types';

const fetchBlogpostMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const resolveMemberMock = vi.fn();
const extractTocMock = vi.fn();
const extractFirstParagraphMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchBlogpost: (...args: unknown[]) => fetchBlogpostMock(...args),
  loadMemberRegistry: () => loadMemberRegistryMock(),
}));

vi.mock('~/modules/content/members', () => ({
  resolveMember: (...args: unknown[]) => resolveMemberMock(...args),
}));

vi.mock('~/modules/content/toc', () => ({
  extractToc: (...args: unknown[]) => extractTocMock(...args),
  extractFirstParagraph: (...args: unknown[]) =>
    extractFirstParagraphMock(...args),
}));

function blogEntry(
  overrides: Partial<BlogpostFrontmatter> & { slug?: string } = {},
): MarkdocFile<BlogpostFrontmatter> {
  const { slug = 'test-slug', ...frontmatterOverrides } = overrides;
  return {
    slug,
    content: null as unknown as RenderableTreeNode,
    markdown: '# Test\n\nIntro paragraph.',
    frontmatter: {
      title: 'Test Article',
      description: 'Test description',
      author: 'jerome-boileux',
      image: 'https://example.com/image.jpg',
      date: '2024-01-15',
      tags: ['revops'],
      read: '5 min',
      ...frontmatterOverrides,
    },
  };
}

afterEach(() => {
  fetchBlogpostMock.mockReset();
  loadMemberRegistryMock.mockReset();
  resolveMemberMock.mockReset();
  extractTocMock.mockReset();
  extractFirstParagraphMock.mockReset();
});

describe('blog detail loader', () => {
  it('throws 404 when slug is missing', async () => {
    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, { params: {} });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('throws 404 when fetchBlogpost returns non-200', async () => {
    fetchBlogpostMock.mockResolvedValueOnce([404, 'not_found', undefined]);
    loadMemberRegistryMock.mockResolvedValueOnce({});

    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, { params: { slug: 'missing' } });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('returns article, toc, and intro synchronously on happy path', async () => {
    const article = blogEntry();
    fetchBlogpostMock.mockResolvedValueOnce([200, 'success', article]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractTocMock.mockReturnValueOnce([{ id: 'test', children: [] }]);
    extractFirstParagraphMock.mockReturnValueOnce('Intro paragraph.');

    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test-slug' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.article).toBe(article);
    expect(outcome.data.toc).toEqual([{ id: 'test', children: [] }]);
    expect(outcome.data.intro).toBe('Intro paragraph.');
  });

  it('returns author as a deferred promise that resolves to the resolved member', async () => {
    const article = blogEntry();
    const resolvedAuthor = {
      slug: 'jerome-boileux',
      name: 'Jérôme Boileux',
      role: 'Founder',
    };
    fetchBlogpostMock.mockResolvedValueOnce([200, 'success', article]);
    loadMemberRegistryMock.mockResolvedValueOnce({
      'jerome-boileux': resolvedAuthor,
    });
    resolveMemberMock.mockReturnValueOnce(resolvedAuthor);
    extractTocMock.mockReturnValueOnce([]);
    extractFirstParagraphMock.mockReturnValueOnce(null);

    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test-slug' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.author).toBeInstanceOf(Promise);
    await expect(outcome.data.author).resolves.toEqual(resolvedAuthor);
  });

  it('uses frontmatter.exerpt as intro when set', async () => {
    const article = blogEntry({ exerpt: 'Explicit excerpt text.' });
    fetchBlogpostMock.mockResolvedValueOnce([200, 'success', article]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractTocMock.mockReturnValueOnce([]);

    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test-slug' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.intro).toBe('Explicit excerpt text.');
    expect(extractFirstParagraphMock).not.toHaveBeenCalled();
  });

  it('falls back to extractFirstParagraph when no exerpt', async () => {
    const article = blogEntry();
    fetchBlogpostMock.mockResolvedValueOnce([200, 'success', article]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractTocMock.mockReturnValueOnce([]);
    extractFirstParagraphMock.mockReturnValueOnce('Extracted paragraph.');

    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test-slug' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.intro).toBe('Extracted paragraph.');
    expect(extractFirstParagraphMock).toHaveBeenCalledOnce();
  });

  it('throws 404 when lang param is invalid', async () => {
    const { loader } = await import('./_main.blog.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test', lang: 'de' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('calls fetchBlogpost with EN lang when lang param is en', async () => {
    const article = blogEntry();
    fetchBlogpostMock.mockResolvedValueOnce([200, 'success', article]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractTocMock.mockReturnValueOnce([]);
    extractFirstParagraphMock.mockReturnValueOnce(null);

    const { loader } = await import('./_main.blog.$slug');
    await invokeLoader(loader, { params: { slug: 'en-post', lang: 'en' } });

    expect(fetchBlogpostMock).toHaveBeenCalledWith('en-post', 'en');
  });
});
