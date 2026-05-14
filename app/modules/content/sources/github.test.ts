// @vitest-environment node
// Why node: jsdom replaces the global fetch after MSW's server.listen() patches
// it, which prevents MSW from intercepting requests. Node env keeps the patched
// fetch intact for the duration of the test file.

/**
 * Integration tests for GitHubContentSource.
 *
 * Tests use MSW to intercept fetch calls. All URLs follow the pattern:
 *   GET <baseUrl>/<path>[/<slug>.md]?ref=<branch>
 *
 * Coverage (#133 acceptance criteria):
 *  1. fetchSingle happy path — parsed frontmatter returned
 *  2. fetchSingle 404 → not_found
 *  3. fetchSingle 403 (rate limit) → source_error
 *  4. fetchSingle timeout → source_error
 *  5. fetchSingle network error → source_error
 *  6. fetchMultiple happy path — all files returned
 *  7. fetchMultiple empty directory → []
 *  8. fetchMultiple directory 404 → not_found
 *  9. fetchMultiple at batchSize=10 (current default) — all 10 files returned
 * 10. fetchMultiple at batchSize=25 (perf target) — all 25 files returned
 * 11. fetchMultiple: one file fails (non-404) → source_error for the whole call
 * 12. fetchMultiple: skips files with ignore:true frontmatter
 * 13. fetchMetadata: slugs are normalised (no .md suffix)
 * 14. fetchMetadata: non-.md entries are excluded
 */

import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '~/test/msw/server';
import type { StoryFrontmatter } from '~/types';
import { GitHubContentSource } from './github';

const BASE_URL = 'https://api.github.test';
const BRANCH = 'main';
const PATH = 'stories';

function makeSource(
  opts: { batchSize?: number; timeout?: number } = {},
): GitHubContentSource {
  return new GitHubContentSource(
    {
      baseUrl: BASE_URL,
      accessToken: 'test-token',
      batchSize: opts.batchSize ?? 3,
      timeout: opts.timeout ?? 5000,
    },
    () => ({}),
    BRANCH,
  );
}

const storyValidator = {
  isValid: (data: unknown): data is StoryFrontmatter =>
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'date' in data,
  schema: {
    safeParse: (data: unknown) => {
      const ok =
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        'date' in data;
      return ok
        ? { success: true as const, data: data as StoryFrontmatter }
        : { success: false as const, error: { issues: [] } };
    },
  } as any,
  typeName: 'Story',
};

function storyMarkdown(slug: string, extra = ''): string {
  return `---
name: ${slug}
date: 2024-01-01
title: ${slug} Story
subtitle: A subtitle
description: A description
speaker: Jane Doe
role: CRO
duration: 3 months
scopes: []
tools: []
quotes:
  - Great work
deliverables: []
${extra}---

Content for ${slug}.
`;
}

function dirEntry(slug: string) {
  return {
    type: 'file',
    name: `${slug}.md`,
    download_url: `${BASE_URL}/${PATH}/${slug}.md`,
    url: `${BASE_URL}/${PATH}/${slug}.md`,
  };
}

const dirUrl = `${BASE_URL}/${PATH}`;
const fileUrl = (slug: string) => `${BASE_URL}/${PATH}/${slug}.md`;

// MSW uses glob/pattern matching — add ?ref=main via searchParams in the handler
function dirHandler(slugs: string[]) {
  return http.get(dirUrl, () => HttpResponse.json(slugs.map(dirEntry)));
}

function fileHandler(slug: string, status = 200) {
  if (status !== 200) {
    return http.get(fileUrl(slug), () => new HttpResponse(null, { status }));
  }
  return http.get(fileUrl(slug), () => HttpResponse.text(storyMarkdown(slug)));
}

describe('GitHubContentSource — fetchSingle', () => {
  it('returns parsed content when GitHub responds 200', async () => {
    server.use(fileHandler('acme'));

    const source = makeSource();
    const [status, state, data] = await source.fetchSingle(
      PATH,
      'acme',
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data?.slug).toBe('acme');
    expect(data?.frontmatter).toMatchObject({
      name: 'acme',
      date: '2024-01-01',
    });
  });

  it('returns not_found when GitHub responds 404', async () => {
    server.use(fileHandler('missing', 404));

    const source = makeSource();
    const [status, state, data] = await source.fetchSingle(
      PATH,
      'missing',
      storyValidator,
    );

    expect(status).toBe(404);
    expect(state).toBe('not_found');
    expect(data).toBeUndefined();
  });

  it('returns source_error on 403 rate-limit response', async () => {
    server.use(
      http.get(
        fileUrl('rate-limited'),
        () =>
          new HttpResponse(null, {
            status: 403,
            headers: { 'X-RateLimit-Remaining': '0' },
          }),
      ),
    );

    const source = makeSource();
    const [status, state, data] = await source.fetchSingle(
      PATH,
      'rate-limited',
      storyValidator,
    );

    expect(status).toBe(403);
    expect(state).toBe('source_error');
    expect(data).toBeUndefined();
  });

  it('returns source_error when request times out', async () => {
    server.use(
      http.get(fileUrl('slow'), async () => {
        await new Promise((r) => setTimeout(r, 200));
        return HttpResponse.text(storyMarkdown('slow'));
      }),
    );

    const source = makeSource({ timeout: 50 });
    const [status, state, data] = await source.fetchSingle(
      PATH,
      'slow',
      storyValidator,
    );

    expect(status).toBe(500);
    expect(state).toBe('source_error');
    expect(data).toBeUndefined();
  });

  it('returns source_error on network error', async () => {
    server.use(http.get(fileUrl('broken'), () => HttpResponse.error()));

    const source = makeSource();
    const [status, state, data] = await source.fetchSingle(
      PATH,
      'broken',
      storyValidator,
    );

    expect(status).toBe(500);
    expect(state).toBe('source_error');
    expect(data).toBeUndefined();
  });
});

describe('GitHubContentSource — fetchMultiple', () => {
  it('returns all files from a directory', async () => {
    server.use(
      dirHandler(['acme', 'beta']),
      fileHandler('acme'),
      fileHandler('beta'),
    );

    const source = makeSource();
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toHaveLength(2);
    expect(data?.map((d) => d.slug)).toEqual(['acme', 'beta']);
  });

  it('returns empty array for a directory with no .md files', async () => {
    server.use(
      http.get(dirUrl, () =>
        HttpResponse.json([
          {
            type: 'dir',
            name: 'subfolder',
            url: `${BASE_URL}/${PATH}/subfolder`,
          },
        ]),
      ),
    );

    const source = makeSource();
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toEqual([]);
  });

  it('returns not_found when directory listing returns 404', async () => {
    server.use(http.get(dirUrl, () => new HttpResponse(null, { status: 404 })));

    const source = makeSource();
    const [status, state] = await source.fetchMultiple(PATH, storyValidator);

    expect(status).toBe(404);
    expect(state).toBe('not_found');
  });

  it('returns all 10 files with batchSize=10 (current default boundary)', async () => {
    const slugs = Array.from({ length: 10 }, (_, i) => `story-${i}`);
    server.use(dirHandler(slugs), ...slugs.map((slug) => fileHandler(slug)));

    const source = makeSource({ batchSize: 10 });
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toHaveLength(10);
  });

  it('returns all 25 files with batchSize=25 (perf target)', async () => {
    const slugs = Array.from({ length: 25 }, (_, i) => `story-${i}`);
    server.use(dirHandler(slugs), ...slugs.map((slug) => fileHandler(slug)));

    const source = makeSource({ batchSize: 25 });
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toHaveLength(25);
  });

  it('returns source_error when a file in a batch returns 403', async () => {
    server.use(
      dirHandler(['ok', 'bad']),
      fileHandler('ok'),
      http.get(
        fileUrl('bad'),
        () =>
          new HttpResponse(null, {
            status: 403,
            headers: { 'X-RateLimit-Remaining': '0' },
          }),
      ),
    );

    const source = makeSource({ batchSize: 10 });
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(403);
    expect(state).toBe('source_error');
    expect(data).toBeUndefined();
  });

  it('skips files with ignore:true frontmatter', async () => {
    server.use(
      dirHandler(['keep', 'skip']),
      fileHandler('keep'),
      http.get(fileUrl('skip'), () =>
        HttpResponse.text(storyMarkdown('skip', 'ignore: true\n')),
      ),
    );

    const source = makeSource();
    const [status, state, data] = await source.fetchMultiple(
      PATH,
      storyValidator,
    );

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toHaveLength(1);
    expect(data?.[0].slug).toBe('keep');
  });
});

describe('GitHubContentSource — fetchMetadata', () => {
  it('returns slugs without .md extension', async () => {
    server.use(dirHandler(['acme', 'beta']));

    const source = makeSource();
    const [status, state, data] = await source.fetchMetadata!(PATH);

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data?.map((m) => m.slug)).toEqual(['acme', 'beta']);
  });

  it('excludes non-.md files from metadata', async () => {
    server.use(
      http.get(dirUrl, () =>
        HttpResponse.json([
          dirEntry('acme'),
          {
            type: 'file',
            name: 'README.txt',
            url: `${BASE_URL}/${PATH}/README.txt`,
          },
          { type: 'dir', name: 'assets', url: `${BASE_URL}/${PATH}/assets` },
        ]),
      ),
    );

    const source = makeSource();
    const [status, state, data] = await source.fetchMetadata!(PATH);

    expect(status).toBe(200);
    expect(state).toBe('success');
    expect(data).toHaveLength(1);
    expect(data?.[0].slug).toBe('acme');
  });
});
