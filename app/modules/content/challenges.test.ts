// @vitest-environment node
// Why node: jsdom replaces the global fetch after MSW's server.listen() patches
// it, which prevents MSW from intercepting the GitHub requests.

/**
 * Challenge content API: `fetchChallenge`, `fetchChallenges` and
 * `fetchValidChallenges` read `challenges/<lang>/<slug>.md` from both content
 * sources. The filesystem source reads the website test fixtures; the GitHub
 * source gets the same files through MSW.
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

// `invalid/` holds a file the schema rejects. No language folder has it, so
// the language lists stay valid.
const FOLDERS = ['fr', 'en', 'invalid'];

// Serves `challenges/<folder>/` from the fixtures, as the GitHub contents API
// does: a JSON listing for the directory, the raw file for each slug. Any
// other folder is a 404.
function githubHandlers() {
  const folders = FOLDERS.flatMap((lang) => {
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
  return [
    ...folders,
    http.get(
      `${GITHUB_URL}/challenges/:lang`,
      () => new HttpResponse(null, { status: 404 }),
    ),
  ];
}

describe.each(['locale', 'github'])('challenge content API (%s)', (source) => {
  let fetchChallenge: Api['fetchChallenge'];
  let fetchChallenges: Api['fetchChallenges'];
  let fetchValidChallenges: Api['fetchValidChallenges'];

  beforeEach(async () => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    if (source === 'github') {
      server.use(...githubHandlers());
    }
    ({ fetchChallenge, fetchChallenges, fetchValidChallenges } =
      await loadApi(source));
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

  it('returns not_found for a language without a folder', async () => {
    const [status, state, data] = await fetchChallenges('de');

    expect(status).toBe(404);
    expect(state).toBe('not_found');
    expect(data).toBeUndefined();
  });

  it('returns validation_error for a file the schema rejects', async () => {
    const [status, state, data] = await fetchChallenge('over-cap', 'invalid');

    expect(status).toBe(422);
    expect(state).toBe('validation_error');
    expect(data).toBeUndefined();
  });

  it('lists every valid challenge of a language, leniently', async () => {
    const [status, state, data] = await fetchValidChallenges('fr');

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data?.map(({ slug }) => slug).sort()).toEqual(FRENCH_SLUGS);
  });

  it('skips and logs a file the schema rejects, where the strict list fails', async () => {
    const [strictStatus] = await fetchChallenges('invalid');
    const [status, state, data] = await fetchValidChallenges('invalid');

    expect(strictStatus).not.toBe(200);
    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(
      '[challenges] skipped invalid/over-cap:',
      422,
      'validation_error',
    );
  });

  it('skips and logs a file whose frontmatter is not valid YAML', async () => {
    // A parse error stays the same on a retry: skip it like a schema error,
    // or one typo would fail the whole list.
    const [status, state, data] = await fetchValidChallenges('invalid');

    expect([status, state, data]).toEqual([200, 'success', []]);
    expect(console.error).toHaveBeenCalledWith(
      '[challenges] skipped invalid/bad-yaml:',
      422,
      'validation_error',
    );
  });

  it('returns not_found from the lenient list for a missing folder', async () => {
    const [status, state, data] = await fetchValidChallenges('de');

    expect(status).toBe(404);
    expect(state).toBe('not_found');
    expect(data).toBeUndefined();
  });
});

describe('fetchValidChallenges (github), transient file failure', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fails the whole list when one file answers a server error', async () => {
    // A partial list would be cached as complete: fail so the cache keeps
    // the last full list and retries.
    server.use(
      http.get(
        `${GITHUB_URL}/challenges/fr/revenue-ai.md`,
        () => new HttpResponse(null, { status: 502 }),
      ),
      ...githubHandlers(),
    );
    const { fetchValidChallenges } = await loadApi('github');

    const [status, state, data] = await fetchValidChallenges('fr');

    expect(status).toBe(502);
    expect(state).toBe('source_error');
    expect(data).toBeUndefined();
  });
});
