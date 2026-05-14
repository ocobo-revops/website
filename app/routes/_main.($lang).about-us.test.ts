/**
 * Loader tests for the about-us route.
 *
 * Behaviors verified:
 *  1. Returns correct data when i18n + member registry both succeed.
 *  2. getFixedT and loadMemberRegistry fire in parallel (not sequentially).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

const getFixedTMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const getFeaturedAboutMembersMock = vi.fn();
const getTrackColorMock = vi.fn();

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (...args: unknown[]) => getFixedTMock(...args),
  },
}));

vi.mock('~/modules/content', async (importOriginal) => {
  const original = await importOriginal<typeof import('~/modules/content')>();
  return {
    ...original,
    loadMemberRegistry: () => loadMemberRegistryMock(),
    getFeaturedAboutMembers: (...args: unknown[]) =>
      getFeaturedAboutMembersMock(...args),
    getTrackColor: (...args: unknown[]) => getTrackColorMock(...args),
  };
});

vi.mock('~/modules/feature-flags', () => ({
  isPageEnabled: () => true,
}));

vi.mock('~/utils/redirections', () => ({
  redirectWithLocale: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('about-us loader', () => {
  it('returns title, description and mapped members from parallel i18n + registry calls', async () => {
    const fakeRegistry = {};
    const fakeMember = {
      slug: 'alice',
      name: 'Alice',
      role: { fr: 'Directrice', en: 'Director' },
      bio: { fr: 'Bio FR', en: 'Bio EN' },
      avatar: '/avatar.jpg',
      linkedin: 'https://linkedin.com/in/alice',
      color: 'ocobo.yellow' as const,
      track: 'ops' as const,
    };

    getFixedTMock.mockResolvedValue((key: string) => `fr:${key}`);
    loadMemberRegistryMock.mockResolvedValue(fakeRegistry);
    getFeaturedAboutMembersMock.mockReturnValue([fakeMember]);

    const { loader } = await import('./_main.($lang).about-us');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/about-us',
      params: {},
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('fr:meta.title');
    expect(outcome.data.description).toBe('fr:meta.description');
    expect(outcome.data.members).toHaveLength(1);
    expect(outcome.data.members[0]).toMatchObject({
      slug: 'alice',
      name: 'Alice',
      role: 'Directrice',
      bio: 'Bio FR',
    });
    expect(getFeaturedAboutMembersMock).toHaveBeenCalledWith(fakeRegistry);
  });

  it('fires getFixedT and loadMemberRegistry in parallel', async () => {
    let resolveT!: (fn: (key: string) => string) => void;
    let resolveRegistry!: (registry: Record<string, unknown>) => void;
    const tPromise = new Promise<(key: string) => string>((r) => {
      resolveT = r;
    });
    const registryPromise = new Promise<Record<string, unknown>>((r) => {
      resolveRegistry = r;
    });

    getFixedTMock.mockReturnValue(tPromise);
    loadMemberRegistryMock.mockReturnValue(registryPromise);
    getFeaturedAboutMembersMock.mockReturnValue([]);

    const { loader } = await import('./_main.($lang).about-us');
    const loaderPromise = invokeLoader(loader, {
      url: 'http://test.local/about-us',
      params: {},
    });

    await new Promise((r) => setImmediate(r));

    expect(getFixedTMock).toHaveBeenCalledTimes(1);
    expect(loadMemberRegistryMock).toHaveBeenCalledTimes(1);

    resolveT((key: string) => `fr:${key}`);
    resolveRegistry({});
    await loaderPromise;
  });
});
