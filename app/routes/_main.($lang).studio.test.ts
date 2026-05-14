/**
 * Loader tests for the studio route.
 *
 * Behaviors verified:
 *  1. Returns correct data when i18n + member registry both succeed.
 *  2. getFixedT and loadMemberRegistry fire in parallel (not sequentially).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

const getFixedTMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const getActiveMembersMock = vi.fn();

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (...args: unknown[]) => getFixedTMock(...args),
  },
}));

vi.mock('~/modules/content/members', () => ({
  loadMemberRegistry: () => loadMemberRegistryMock(),
  getActiveMembers: (...args: unknown[]) => getActiveMembersMock(...args),
}));

vi.mock('~/modules/feature-flags', () => ({
  throwIfDisabled: vi.fn(),
}));

vi.mock('~/utils/redirections', () => ({
  redirectWithLocale: vi.fn().mockResolvedValue(undefined),
}));

afterEach(() => {
  vi.resetAllMocks();
});

describe('studio loader', () => {
  it('returns title, description and members from parallel i18n + registry calls', async () => {
    const fakeRegistry = { alice: { slug: 'alice', name: 'Alice' } };
    const fakeMembers = [{ slug: 'alice', name: 'Alice' }];

    getFixedTMock.mockResolvedValue((key: string) => `fr:${key}`);
    loadMemberRegistryMock.mockResolvedValue(fakeRegistry);
    getActiveMembersMock.mockReturnValue(fakeMembers);

    const { loader } = await import('./_main.($lang).studio');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/studio',
      params: {},
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe('fr:meta.title');
    expect(outcome.data.description).toBe('fr:meta.description');
    expect(outcome.data.members).toBe(fakeMembers);
    expect(outcome.data.lang).toBe('fr');
    expect(getActiveMembersMock).toHaveBeenCalledWith(fakeRegistry);
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
    getActiveMembersMock.mockReturnValue([]);

    const { loader } = await import('./_main.($lang).studio');
    const loaderPromise = invokeLoader(loader, {
      url: 'http://test.local/studio',
      params: {},
    });

    // Let the loader run past its first await point.
    await new Promise((r) => setImmediate(r));

    // Both must be called before either resolves — sequential awaits would
    // only call loadMemberRegistry after getFixedT settles.
    expect(getFixedTMock).toHaveBeenCalledTimes(1);
    expect(loadMemberRegistryMock).toHaveBeenCalledTimes(1);

    resolveT((key: string) => `fr:${key}`);
    resolveRegistry({});
    await loaderPromise;
  });
});
