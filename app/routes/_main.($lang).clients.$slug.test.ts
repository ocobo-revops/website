/**
 * Loader tests for the clients (story) detail route.
 *
 * Covers the observable behaviours of `loader` in
 * `_main.($lang).clients.$slug.tsx`:
 *  1. 404 when slug is missing from params
 *  2. 404 when `fetchStory` returns a non-200 status
 *  3. Happy path: article + resolvedTools returned synchronously
 *  4. `resolvedTeam` returned as a deferred promise (footer-only)
 *
 * `resolvedTools` stays on the critical path because StoryMetas renders
 * tool icons in the above-the-fold sidebar.
 */

import type { RenderableTreeNode } from '@markdoc/markdoc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { StoryFrontmatter } from '~/modules/schemas';
import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile } from '~/types';

const fetchStoryMock = vi.fn();
const loadToolRegistryMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const resolveToolMock = vi.fn();
const resolveTeamMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchStory: (...args: unknown[]) => fetchStoryMock(...args),
  loadToolRegistry: () => loadToolRegistryMock(),
  loadMemberRegistry: () => loadMemberRegistryMock(),
  resolveTool: (...args: unknown[]) => resolveToolMock(...args),
  resolveTeam: (...args: unknown[]) => resolveTeamMock(...args),
}));

function storyEntry(
  overrides: Partial<StoryFrontmatter> & { slug?: string } = {},
): MarkdocFile<StoryFrontmatter> {
  const { slug = 'ekodev', ...frontmatterOverrides } = overrides;
  return {
    slug,
    content: null as unknown as RenderableTreeNode,
    markdown: '## Context\n\nClient story.',
    frontmatter: {
      title: 'Ekodev story',
      subtitle: 'How Ekodev scaled RevOps',
      image: 'https://example.com/ekodev.jpg',
      logo: 'https://example.com/ekodev-logo.svg',
      sector: 'SaaS',
      tools: ['hubspot', 'salesforce'],
      team: ['jerome-boileux'],
      deliverables: [],
      ...frontmatterOverrides,
    } as StoryFrontmatter,
  };
}

afterEach(() => {
  fetchStoryMock.mockReset();
  loadToolRegistryMock.mockReset();
  loadMemberRegistryMock.mockReset();
  resolveToolMock.mockReset();
  resolveTeamMock.mockReset();
});

describe('clients detail loader', () => {
  it('throws 404 when slug is missing', async () => {
    const { loader } = await import('./_main.($lang).clients.$slug');
    const outcome = await invokeLoader(loader, { params: {} });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('throws 404 when fetchStory returns non-200', async () => {
    fetchStoryMock.mockResolvedValueOnce([404, 'not_found', undefined]);
    loadToolRegistryMock.mockResolvedValueOnce({});
    loadMemberRegistryMock.mockResolvedValueOnce({});

    const { loader } = await import('./_main.($lang).clients.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'missing' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('returns article and resolvedTools synchronously on happy path', async () => {
    const article = storyEntry();
    const tool = {
      slug: 'hubspot',
      name: 'HubSpot',
      icon: 'https://example.com/hubspot.svg',
    };
    fetchStoryMock.mockResolvedValueOnce([200, 'success', article]);
    loadToolRegistryMock.mockResolvedValueOnce({ hubspot: tool });
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveToolMock.mockReturnValueOnce(tool).mockReturnValueOnce(null);
    resolveTeamMock.mockReturnValueOnce([]);

    const { loader } = await import('./_main.($lang).clients.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'ekodev' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const data = outcome.data as {
      article: typeof article;
      resolvedTools: unknown[];
    };
    expect(data.article).toBe(article);
    expect(data.resolvedTools).toEqual([tool]);
  });

  it('returns resolvedTeam as a deferred promise', async () => {
    const article = storyEntry();
    const member = {
      slug: 'jerome-boileux',
      name: 'Jérôme Boileux',
      role: 'Founder',
    };
    fetchStoryMock.mockResolvedValueOnce([200, 'success', article]);
    loadToolRegistryMock.mockResolvedValueOnce({});
    loadMemberRegistryMock.mockResolvedValueOnce({
      'jerome-boileux': member,
    });
    resolveToolMock.mockReturnValue(null);
    resolveTeamMock.mockReturnValueOnce([member]);

    const { loader } = await import('./_main.($lang).clients.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'ekodev' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const data = outcome.data as { resolvedTeam: unknown };
    expect(data.resolvedTeam).toBeInstanceOf(Promise);
    await expect(data.resolvedTeam).resolves.toEqual([member]);
  });
});
