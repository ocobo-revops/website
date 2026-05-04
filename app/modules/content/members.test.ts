import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getPrivateEnvVars } from '../env.server';
import {
  type Member,
  type MemberRegistry,
  __resetMemberRegistryCache,
  fetchMembers,
  getActiveMembers,
  getFeaturedAboutMembers,
  getMembersByTrack,
  loadMemberRegistry,
  resolveAuthor,
  resolveMember,
} from './members';

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
  __resetMemberRegistryCache();
});

const member = (overrides: Partial<Member>): Member => ({
  slug: overrides.slug ?? 'benjamin-boileux',
  name: overrides.name ?? 'Benjamin Boileux',
  role: overrides.role ?? { fr: 'Associé', en: 'Partner' },
  track: overrides.track ?? 'architect',
  avatar: overrides.avatar ?? 'https://blob/benjamin.jpg',
  displayOrder: overrides.displayOrder ?? 1,
  active: overrides.active ?? true,
  bio: overrides.bio ?? { fr: 'fr bio', en: 'en bio' },
  featuredOnAboutUs: overrides.featuredOnAboutUs ?? false,
  linkedin: overrides.linkedin,
});

const asMarkdocFiles = (members: Member[]) =>
  members.map((m) => {
    const { slug, ...frontmatter } = m;
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

describe('resolveMember', () => {
  const registry: MemberRegistry = {
    'benjamin-boileux': member({ slug: 'benjamin-boileux' }),
  };

  it('returns the member when the slug is known', () => {
    expect(resolveMember('benjamin-boileux', registry)?.name).toBe(
      'Benjamin Boileux',
    );
  });

  it('returns null when the slug is unknown', () => {
    expect(resolveMember('unknown', registry)).toBeNull();
  });
});

describe('getActiveMembers', () => {
  it('filters out inactive members and sorts by displayOrder ascending', () => {
    const registry: MemberRegistry = {
      a: member({ slug: 'a', displayOrder: 3, active: true, name: 'A' }),
      b: member({ slug: 'b', displayOrder: 1, active: false, name: 'B' }),
      c: member({ slug: 'c', displayOrder: 2, active: true, name: 'C' }),
    };
    const result = getActiveMembers(registry);
    expect(result.map((m) => m.name)).toEqual(['C', 'A']);
  });
});

describe('getMembersByTrack', () => {
  it('filters to a single track preserving displayOrder ascending', () => {
    const registry: MemberRegistry = {
      a: member({
        slug: 'a',
        track: 'architect',
        displayOrder: 2,
        name: 'A',
      }),
      b: member({ slug: 'b', track: 'builder', displayOrder: 1, name: 'B' }),
      c: member({
        slug: 'c',
        track: 'architect',
        displayOrder: 1,
        name: 'C',
      }),
    };
    const result = getMembersByTrack(registry, 'architect');
    expect(result.map((m) => m.name)).toEqual(['C', 'A']);
  });

  it('excludes inactive members of the requested track', () => {
    const registry: MemberRegistry = {
      a: member({ slug: 'a', track: 'architect', active: false }),
      b: member({ slug: 'b', track: 'architect', active: true }),
    };
    const result = getMembersByTrack(registry, 'architect');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('b');
  });
});

describe('getFeaturedAboutMembers', () => {
  it('returns active + featured members sorted by displayOrder', () => {
    const registry: MemberRegistry = {
      a: member({
        slug: 'a',
        featuredOnAboutUs: true,
        displayOrder: 2,
        active: true,
      }),
      b: member({
        slug: 'b',
        featuredOnAboutUs: false,
        displayOrder: 1,
        active: true,
      }),
      c: member({
        slug: 'c',
        featuredOnAboutUs: true,
        displayOrder: 1,
        active: true,
      }),
      d: member({
        slug: 'd',
        featuredOnAboutUs: true,
        displayOrder: 0,
        active: false,
      }),
    };
    const result = getFeaturedAboutMembers(registry);
    expect(result.map((m) => m.slug)).toEqual(['c', 'a']);
  });
});

describe('loadMemberRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    __resetMemberRegistryCache();
  });

  it('loads multiple members from the content pipeline keyed by slug', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([
      200,
      'success',
      asMarkdocFiles([
        member({ slug: 'a', name: 'A' }),
        member({ slug: 'b', name: 'B' }),
      ]),
    ]);

    const registry = await loadMemberRegistry();

    expect(Object.keys(registry).sort()).toEqual(['a', 'b']);
    expect(registry.a.name).toBe('A');
  });

  it('returns an empty registry when the team directory has no members', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([200, 'success', []]);

    const registry = await loadMemberRegistry();

    expect(registry).toEqual({});
  });

  it('returns an empty registry when the source returns not_found (degrade gracefully)', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([404, 'not_found', undefined]);

    const registry = await loadMemberRegistry();

    expect(registry).toEqual({});
  });

  it('caches the registry across calls with the same source key', async () => {
    setEnv();
    mockFetchContents.mockResolvedValue([
      200,
      'success',
      asMarkdocFiles([member({ slug: 'a' })]),
    ]);

    const first = await loadMemberRegistry();
    const second = await loadMemberRegistry();

    expect(first).toBe(second);
    expect(mockFetchContents).toHaveBeenCalledTimes(1);
  });

  it('invalidates the cache when readContentFrom changes', async () => {
    setEnv({ readContentFrom: 'locale' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([member({ slug: 'local' })]),
    ]);
    await loadMemberRegistry();

    setEnv({ readContentFrom: 'github', githubBranch: 'main' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([member({ slug: 'remote' })]),
    ]);
    const second = await loadMemberRegistry();

    expect(Object.keys(second)).toEqual(['remote']);
    expect(mockFetchContents).toHaveBeenCalledTimes(2);
  });

  it('invalidates the cache when githubBranch changes', async () => {
    setEnv({ readContentFrom: 'github', githubBranch: 'main' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([member({ slug: 'main-x' })]),
    ]);
    await loadMemberRegistry();

    setEnv({ readContentFrom: 'github', githubBranch: 'feature/team' });
    mockFetchContents.mockResolvedValueOnce([
      200,
      'success',
      asMarkdocFiles([member({ slug: 'feature-x' })]),
    ]);
    const second = await loadMemberRegistry();

    expect(Object.keys(second)).toEqual(['feature-x']);
    expect(mockFetchContents).toHaveBeenCalledTimes(2);
  });
});

describe('resolveAuthor', () => {
  const registry: MemberRegistry = {
    'benjamin-boileux': member({
      slug: 'benjamin-boileux',
      name: 'Benjamin Boileux',
      avatar: 'https://blob/benjamin.jpg',
      linkedin: 'https://linkedin.com/in/benjaminboileux',
      active: true,
    }),
    'ethel-gosset': member({
      slug: 'ethel-gosset',
      name: 'Ethel Gosset',
      avatar: 'https://blob/ethel.jpg',
      linkedin: 'https://linkedin.com/in/ethelgosset',
      active: false,
    }),
  };

  it('resolves a known active member', () => {
    const result = resolveAuthor('benjamin-boileux', registry);
    expect(result).toEqual({
      name: 'Benjamin Boileux',
      avatar: 'https://blob/benjamin.jpg',
      linkedin: 'https://linkedin.com/in/benjaminboileux',
    });
  });

  it('resolves a known inactive member (historical attribution)', () => {
    const result = resolveAuthor('ethel-gosset', registry);
    expect(result.name).toBe('Ethel Gosset');
    expect(result.avatar).toBe('https://blob/ethel.jpg');
  });

  it('falls back to slug as name for unknown slug', () => {
    const result = resolveAuthor('unknown-author', registry);
    expect(result).toEqual({ name: 'unknown-author' });
    expect(result.avatar).toBeUndefined();
    expect(result.linkedin).toBeUndefined();
  });
});

describe('fetchMembers', () => {
  it('fetches from the team/ directory using the member validator', async () => {
    mockFetchContents.mockResolvedValue([200, 'success', []]);
    await fetchMembers();
    expect(mockFetchContents).toHaveBeenCalledWith(
      'team',
      expect.objectContaining({ typeName: 'Member' }),
    );
  });
});
