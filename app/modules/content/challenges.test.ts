// @vitest-environment node
// Why node: jsdom replaces the global fetch after MSW's server.listen() patches
// it, which prevents MSW from intercepting the GitHub requests.

/**
 * Challenge content API: `fetchChallenge` and `fetchChallenges` read
 * `challenges/<lang>/<slug>.md` from both content sources. The filesystem
 * source reads the website test fixtures; the GitHub source gets the same
 * files through MSW.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { http, HttpResponse } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '~/test/msw/server';

const env = vi.hoisted(() => ({
  readContentFrom: 'locale',
  fixturesRoot: `${__dirname}/../../test/fixtures/content`,
  githubUrl: 'https://api.github.test/repos/ocobo/posts/contents',
}));
const FIXTURES_ROOT = env.fixturesRoot;
const GITHUB_URL = env.githubUrl;

vi.mock('../env.server', () => ({
  getPrivateEnvVars: () => ({
    readContentFrom: env.readContentFrom,
    localeRepoAPIUrl: env.fixturesRoot,
    githubRepoAPIUrl: env.githubUrl,
    githubAccessToken: 'test-token',
    githubBranch: 'main',
  }),
}));

// The fetchers in `./api` bind the content source when the module loads, so
// each source gets a fresh copy of the module.
async function loadApi(source: string) {
  env.readContentFrom = source;
  vi.resetModules();
  return import('./api');
}

type Api = typeof import('./api');

const FRENCH_SLUGS = [
  'customer-experience',
  'revenue-ai',
  'revenue-performance',
  'revenue-systems',
  'sales-compensation',
  'sales-experience',
];

// Serves `challenges/<lang>/` from the fixtures, as the GitHub contents API
// does: a JSON listing for the directory, the raw file for each slug.
function githubHandlers() {
  return ['fr', 'en'].flatMap((lang) => {
    const dir = join(FIXTURES_ROOT, 'challenges', lang);
    const dirUrl = `${GITHUB_URL}/challenges/${lang}`;
    const files = readdirSync(dir);
    return [
      http.get(dirUrl, () =>
        HttpResponse.json(
          files.map((name) => ({
            type: 'file',
            name,
            download_url: `${dirUrl}/${name}`,
            url: `${dirUrl}/${name}`,
          })),
        ),
      ),
      http.get(`${dirUrl}/:file`, ({ params }) => {
        const name = String(params.file);
        return files.includes(name)
          ? HttpResponse.text(readFileSync(join(dir, name), 'utf8'))
          : new HttpResponse(null, { status: 404 });
      }),
    ];
  });
}

describe.each(['locale', 'github'])('challenge content API (%s)', (source) => {
  let fetchChallenge: Api['fetchChallenge'];
  let fetchChallenges: Api['fetchChallenges'];

  beforeEach(async () => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    if (source === 'github') {
      server.use(...githubHandlers());
    }
    ({ fetchChallenge, fetchChallenges } = await loadApi(source));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches one challenge by language and slug', async () => {
    const [status, state, data] = await fetchChallenge('revenue-ai', 'fr');

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data?.slug).toBe('revenue-ai');
    expect(data?.frontmatter.key).toBe('ai');
    expect(data?.frontmatter.method.title).toBe('Le Revenue AI Sprint');
  });

  it('reads the file of the requested language', async () => {
    const [, , french] = await fetchChallenge('revenue-performance', 'fr');
    const [, , english] = await fetchChallenge('revenue-performance', 'en');

    expect(french?.frontmatter.tagline).toBe('Un chiffre que vous voyez venir');
    expect(english?.frontmatter.tagline).toBe('A number you can see coming');
  });

  it('fetches every challenge of a language', async () => {
    const [status, state, data] = await fetchChallenges('fr');

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data?.map(({ slug }) => slug).sort()).toEqual(FRENCH_SLUGS);
  });

  it('fetches only the challenges of the requested language', async () => {
    const [, , data] = await fetchChallenges('en');

    expect(data?.map(({ slug }) => slug)).toEqual(['revenue-performance']);
  });

  it('returns not_found for a missing file', async () => {
    const [status, state, data] = await fetchChallenge('missing', 'fr');

    expect(status).toBe(404);
    expect(state).toBe('not_found');
    expect(data).toBeUndefined();
  });
});
