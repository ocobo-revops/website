/**
 * `_main` layout loader (#237): the navbar challenge list, read from the
 * filesystem content source pointed at the test fixtures.
 */

import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

const env = vi.hoisted(() => ({
  contentRoot: `${__dirname}/../test/fixtures/content`,
}));

vi.mock('~/modules/env.server', () => ({
  getContentSource: () => 'locale',
  getPrivateEnvVars: () => ({
    readContentFrom: 'locale',
    localeRepoAPIUrl: env.contentRoot,
  }),
}));

// The content fetchers bind the source root when `api.ts` loads, so each
// root gets a fresh copy of the route module.
async function loadRoute(contentRoot: string) {
  env.contentRoot = contentRoot;
  vi.resetModules();
  return import('./_main');
}

const FIXTURES = `${__dirname}/../test/fixtures/content`;

async function loadFor(contentRoot: string, lang?: string) {
  const { loader } = await loadRoute(contentRoot);
  const outcome = await invokeLoader(loader, {
    params: lang ? { lang } : {},
  });
  if (outcome.type !== 'data') {
    throw new Error(`Expected data, got ${outcome.response.status}`);
  }
  return outcome.data;
}

async function challengesFor(contentRoot: string, lang?: string) {
  return (await loadFor(contentRoot, lang)).challenges;
}

describe('_main loader', () => {
  beforeEach(() => {
    // Challenges are disabled by default: enable every page.
    vi.stubEnv('DISABLED_PAGES', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns no challenge and reads no content when the flag is disabled', async () => {
    vi.stubEnv('DISABLED_PAGES', undefined);
    const fetchValidChallenges = vi.fn();
    vi.doMock('~/modules/content/api', () => ({ fetchValidChallenges }));

    try {
      expect(await loadFor(FIXTURES)).toEqual({
        challenges: [],
        failed: false,
      });
      expect(fetchValidChallenges).not.toHaveBeenCalled();
    } finally {
      vi.doUnmock('~/modules/content/api');
    }
  });

  it('lists the French challenges in order', async () => {
    const challenges = await challengesFor(FIXTURES);

    expect(challenges.map((challenge) => challenge.slug)).toEqual([
      'sales-experience',
      'customer-experience',
      'revenue-performance',
      'sales-compensation',
      'revenue-systems',
      'revenue-ai',
    ]);
    expect(challenges[0]).toEqual({
      slug: 'sales-experience',
      key: 'se',
      name: 'Sales Experience',
      tagline: "Une organisation commerciale qui passe à l'échelle",
    });
  });

  it('lists only the challenges published in the current language', async () => {
    const challenges = await challengesFor(FIXTURES, 'en');

    expect(challenges).toEqual([
      {
        slug: 'revenue-performance',
        key: 'rp',
        name: 'Revenue Performance',
        tagline: 'A number you can see coming',
      },
    ]);
  });

  it('returns no challenge when the source has no challenges folder', async () => {
    // The fixtures root itself holds `content/` but no `challenges/`.
    expect(await loadFor(`${FIXTURES}/..`)).toEqual({
      challenges: [],
      failed: false,
    });
  });

  it('keeps the valid challenges and logs the one that fails validation', async () => {
    const root = await mkdtemp(join(tmpdir(), 'main-loader-'));
    await mkdir(join(root, 'challenges/fr'), { recursive: true });
    await copyFile(
      join(FIXTURES, 'challenges/fr/revenue-ai.md'),
      join(root, 'challenges/fr/revenue-ai.md'),
    );
    await writeFile(
      join(root, 'challenges/fr/broken.md'),
      '---\ntitle: Missing every other field\n---\n',
    );
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      const challenges = await challengesFor(root);

      expect(challenges.map((challenge) => challenge.slug)).toEqual([
        'revenue-ai',
      ]);
      expect(error).toHaveBeenCalledWith(
        '[challenges] skipped fr/broken:',
        expect.any(Number),
        expect.any(String),
      );
    } finally {
      error.mockRestore();
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe('_main shouldRevalidate', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function revalidates(
    currentParams: Record<string, string>,
    nextParams: Record<string, string>,
    { lastLoadFailed = false } = {},
  ) {
    const { setChallengeLoadFailed } = await import(
      '~/modules/challenge-menu-state'
    );
    setChallengeLoadFailed(lastLoadFailed);
    const { shouldRevalidate } = await import('./_main');
    return shouldRevalidate({
      currentParams,
      nextParams,
      defaultShouldRevalidate: true,
    } as unknown as ShouldRevalidateFunctionArgs);
  }

  it('skips the reload within one language, empty list included', async () => {
    // The flag-off loader and an empty folder report `failed: false`.
    expect(await revalidates({ lang: 'en' }, { lang: 'en' })).toBe(false);
    expect(await revalidates({}, { lang: 'fr' })).toBe(false);
  });

  it('reloads the list when the language changes', async () => {
    expect(await revalidates({ lang: 'fr' }, { lang: 'en' })).toBe(true);
    expect(await revalidates({ lang: 'en' }, {})).toBe(true);
  });

  it('retries within one language after a failed load', async () => {
    const failed = { lastLoadFailed: true };

    expect(await revalidates({ lang: 'en' }, { lang: 'en' }, failed)).toBe(
      true,
    );
    expect(await revalidates({}, {}, failed)).toBe(true);
  });
});
