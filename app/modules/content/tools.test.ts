import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPrivateEnvVars } from '../env.server';
import {
  type Tool,
  type ToolRegistry,
  __resetToolRegistryCache,
  fetchTools,
  loadToolRegistry,
  resolveTool,
} from './tools';

vi.mock('./api', () => ({
  fetchContents: vi.fn(),
}));

vi.mock('../env.server', () => ({
  getPrivateEnvVars: vi.fn(),
}));

const { fetchContents } = await import('./api');
const mockFetchContents = vi.mocked(fetchContents);
const mockGetPrivateEnvVars = vi.mocked(getPrivateEnvVars);

beforeEach(() => {
  __resetToolRegistryCache();
});

const tool = (overrides: Partial<Tool>): Tool => ({
  slug: overrides.slug ?? 'hubspot',
  name: overrides.name ?? 'HubSpot',
  category: overrides.category,
  iconUrl: overrides.iconUrl ?? 'https://blob/hubspot.svg',
  url: overrides.url,
});

const asMarkdocFiles = (tools: Tool[]) =>
  tools.map((t) => {
    const { slug, ...frontmatter } = t;
    return {
      slug,
      content: null,
      markdown: '',
      frontmatter,
    };
  });

const setEnv = (
  overrides: Partial<ReturnType<typeof getPrivateEnvVars>> = {},
) =>
  mockGetPrivateEnvVars.mockReturnValue({
    readContentFrom: 'locale',
    localeRepoAPIUrl: '/posts',
    githubRepoAPIUrl: '',
    githubAccessToken: '',
    githubBranch: 'main',
    env: 'development',
    ...overrides,
  });

describe('resolveTool', () => {
  const registry: ToolRegistry = {
    hubspot: tool({ slug: 'hubspot', name: 'HubSpot' }),
  };

  it('returns the tool when the slug is known', () => {
    expect(resolveTool('hubspot', registry)?.name).toBe('HubSpot');
  });

  it('returns null when the slug is unknown', () => {
    expect(resolveTool('unknown', registry)).toBeNull();
  });

  it('normalises casing — lookup is case-insensitive against the registry slug', () => {
    expect(resolveTool('HubSpot', registry)?.slug).toBe('hubspot');
    expect(resolveTool('HUBSPOT', registry)?.slug).toBe('hubspot');
  });
});

describe('loadToolRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __resetToolRegistryCache();
  });

  it('loads multiple tools from the content pipeline keyed by slug', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([
      200,
      'success',
      asMarkdocFiles([
        tool({ slug: 'hubspot', name: 'HubSpot' }),
        tool({ slug: 'salesforce', name: 'Salesforce' }),
      ]),
    ]);

    const registry = await loadToolRegistry();

    expect(Object.keys(registry).sort()).toEqual(['hubspot', 'salesforce']);
    expect(registry.hubspot.name).toBe('HubSpot');
  });

  it('returns an empty registry when the tools directory has no entries', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([200, 'success', []]);

    const registry = await loadToolRegistry();

    expect(registry).toEqual({});
  });

  it('returns an empty registry when the source returns not_found (degrade gracefully)', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([404, 'not_found', undefined]);

    const registry = await loadToolRegistry();

    expect(registry).toEqual({});
  });

  it('caches the registry across calls with the same source key', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([
      200,
      'success',
      asMarkdocFiles([tool({ slug: 'hubspot' })]),
    ]);

    const first = await loadToolRegistry();
    const second = await loadToolRegistry();

    expect(first).toBe(second);
    expect(mockFetchContents).toHaveBeenCalledTimes(1);
  });

  it('invalidates the cache when readContentFrom changes', async () => {
    setEnv({ readContentFrom: 'locale' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([tool({ slug: 'hubspot' })]),
    ]);
    await loadToolRegistry();

    setEnv({ readContentFrom: 'github', githubBranch: 'main' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([tool({ slug: 'salesforce' })]),
    ]);
    const second = await loadToolRegistry();

    expect(Object.keys(second)).toEqual(['salesforce']);
    expect(mockFetchContents).toHaveBeenCalledTimes(2);
  });
});

describe('fetchTools', () => {
  it('fetches from the tools/ directory using the tool validator', async () => {
    mockFetchContents.mockResolvedValue([200, 'success', []]);
    await fetchTools();
    expect(mockFetchContents).toHaveBeenCalledWith(
      'tools',
      expect.objectContaining({ typeName: 'Tool' }),
    );
  });
});
