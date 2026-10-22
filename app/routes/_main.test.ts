/**
 * `_main` layout loader (#237): the navbar challenge list, read from the
 * filesystem content source pointed at the test fixtures.
 */

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { invokeLoader } from '~/test/loader-harness';

const env = vi.hoisted(() => ({
  contentRoot: `${__dirname}/../test/fixtures/content`,
}));

vi.mock('~/modules/env.server', () => ({
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

async function challengesFor(contentRoot: string, lang?: string) {
  const { loader } = await loadRoute(contentRoot);
  const outcome = await invokeLoader(loader, {
    params: lang ? { lang } : {},
  });
  if (outcome.type !== 'data') {
    throw new Error(`Expected data, got ${outcome.response.status}`);
  }
  return outcome.data.challenges;
}

describe('_main loader', () => {
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
    const challenges = await challengesFor(`${FIXTURES}/..`);

    expect(challenges).toEqual([]);
  });

  it('hides the entry and logs when a challenge fails validation', async () => {
    const root = await mkdtemp(join(tmpdir(), 'main-loader-'));
    await mkdir(join(root, 'challenges/fr'), { recursive: true });
    await writeFile(
      join(root, 'challenges/fr/broken.md'),
      '---\ntitle: Missing every other field\n---\n',
    );
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    try {
      expect(await challengesFor(root)).toEqual([]);
      expect(error).toHaveBeenCalledWith(
        '[_main] challenge list unavailable:',
        500,
        'source_error',
      );
    } finally {
      error.mockRestore();
      await rm(root, { recursive: true, force: true });
    }
  });
});

describe('_main shouldRevalidate', () => {
  async function revalidates(
    currentParams: Record<string, string>,
    nextParams: Record<string, string>,
  ) {
    const { shouldRevalidate } = await import('./_main');
    return shouldRevalidate({
      currentParams,
      nextParams,
      defaultShouldRevalidate: true,
    } as unknown as ShouldRevalidateFunctionArgs);
  }

  it('skips the reload within one language', async () => {
    expect(await revalidates({ lang: 'en' }, { lang: 'en' })).toBe(false);
    expect(await revalidates({}, { lang: 'fr' })).toBe(false);
  });

  it('reloads the list when the language changes', async () => {
    expect(await revalidates({ lang: 'fr' }, { lang: 'en' })).toBe(true);
    expect(await revalidates({ lang: 'en' }, {})).toBe(true);
  });
});
