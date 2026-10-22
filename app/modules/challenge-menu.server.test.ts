/**
 * In-memory cache of the navbar challenge list (#237): one GitHub listing
 * plus one call per file is too much to pay on every page render.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const env = vi.hoisted(() => ({ readContentFrom: 'github' }));
const fetchValidChallenges = vi.hoisted(() => vi.fn());

vi.mock('./env.server', () => ({
  getContentSource: () => env.readContentFrom,
}));

vi.mock('./content/api', () => ({ fetchValidChallenges }));

function challengeFile(slug: string, order: number) {
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      key: 'rp',
      name: slug,
      tagline: `Tagline of ${slug}`,
      order,
    },
  };
}

// The cache lives in module state: each test gets a fresh module.
async function load() {
  vi.resetModules();
  return import('./challenge-menu.server');
}

beforeEach(() => {
  env.readContentFrom = 'github';
  fetchValidChallenges.mockResolvedValue([
    200,
    'success',
    [challengeFile('revenue-ai', 2), challengeFile('revenue-performance', 1)],
  ]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  fetchValidChallenges.mockReset();
});

describe('loadChallengeMenu', () => {
  it('reduces the files to menu entries in order', async () => {
    const { loadChallengeMenu } = await load();

    const { challenges, failed } = await loadChallengeMenu('fr');

    expect(challenges.map(({ slug }) => slug)).toEqual([
      'revenue-performance',
      'revenue-ai',
    ]);
    expect(failed).toBe(false);
    expect(fetchValidChallenges).toHaveBeenCalledWith('fr');
  });

  it('serves a cached list within the TTL, per language', async () => {
    const { loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    await loadChallengeMenu('fr');
    await loadChallengeMenu('en');

    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
    expect(fetchValidChallenges).toHaveBeenNthCalledWith(2, 'en');
  });

  it('fetches again once the TTL has passed', async () => {
    vi.useFakeTimers();
    const { CHALLENGE_MENU_TTL_MS, loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    vi.advanceTimersByTime(CHALLENGE_MENU_TTL_MS + 1);
    await loadChallengeMenu('fr');

    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
  });

  it('fetches again on refresh', async () => {
    const { loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    await loadChallengeMenu('fr', { refresh: true });

    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
  });

  it('serves the last list, flagged as failed, and logs when a fetch fails', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    fetchValidChallenges.mockResolvedValue([500, 'source_error', undefined]);
    const { challenges, failed } = await loadChallengeMenu('fr', {
      refresh: true,
    });

    expect(challenges).toHaveLength(2);
    expect(failed).toBe(true);
    expect(error).toHaveBeenCalledWith(
      '[challenge-menu] challenge list unavailable:',
      500,
      'source_error',
    );
  });

  it('returns an empty list when the first fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchValidChallenges.mockResolvedValue([500, 'source_error', undefined]);
    const { loadChallengeMenu } = await load();

    expect(await loadChallengeMenu('fr')).toEqual({
      challenges: [],
      failed: true,
    });
  });

  it('serves a failure for a short wait, then fetches again', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchValidChallenges.mockResolvedValueOnce([
      500,
      'source_error',
      undefined,
    ]);
    const { CHALLENGE_MENU_RETRY_MS, loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    const waiting = await loadChallengeMenu('fr');
    expect(waiting).toEqual({ challenges: [], failed: true });
    expect(fetchValidChallenges).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(CHALLENGE_MENU_RETRY_MS + 1);
    const { challenges, failed } = await loadChallengeMenu('fr');

    expect(challenges).toHaveLength(2);
    expect(failed).toBe(false);
    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
  });

  it('serves a failure when the fetch throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchValidChallenges.mockRejectedValue(new Error('boom'));
    const { loadChallengeMenu } = await load();

    expect(await loadChallengeMenu('fr')).toEqual({
      challenges: [],
      failed: true,
    });
  });

  it('shares one fetch between concurrent renders', async () => {
    const { loadChallengeMenu } = await load();

    const [first, second] = await Promise.all([
      loadChallengeMenu('fr'),
      loadChallengeMenu('fr'),
    ]);

    expect(first).toBe(second);
    expect(fetchValidChallenges).toHaveBeenCalledTimes(1);
  });

  it('keeps the list of a refresh that ends before an older fetch', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    let endOlderFetch: (value: unknown) => void = () => undefined;
    fetchValidChallenges.mockReturnValueOnce(
      new Promise((resolve) => {
        endOlderFetch = resolve;
      }),
    );
    fetchValidChallenges.mockResolvedValueOnce([
      200,
      'success',
      [challengeFile('revenue-ai', 1)],
    ]);
    const { loadChallengeMenu } = await load();

    const older = loadChallengeMenu('fr');
    await loadChallengeMenu('fr', { refresh: true });
    endOlderFetch([500, 'source_error', undefined]);
    // The older render still gets the newest list, flagged as failed.
    expect(await older).toEqual({
      challenges: [expect.objectContaining({ slug: 'revenue-ai' })],
      failed: true,
    });

    const { challenges, failed } = await loadChallengeMenu('fr');
    expect(challenges.map(({ slug }) => slug)).toEqual(['revenue-ai']);
    expect(failed).toBe(false);
    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
  });

  it('caches a missing folder as an empty list, without logging', async () => {
    const error = vi.spyOn(console, 'error');
    fetchValidChallenges.mockResolvedValue([404, 'not_found', undefined]);
    const { loadChallengeMenu } = await load();

    const empty = { challenges: [], failed: false };
    expect(await loadChallengeMenu('fr')).toEqual(empty);
    expect(await loadChallengeMenu('fr')).toEqual(empty);
    expect(fetchValidChallenges).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
  });

  it('reads the filesystem source on every call', async () => {
    env.readContentFrom = 'locale';
    const { loadChallengeMenu } = await load();

    await loadChallengeMenu('fr');
    await loadChallengeMenu('fr');

    expect(fetchValidChallenges).toHaveBeenCalledTimes(2);
  });
});
