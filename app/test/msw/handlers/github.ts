import { http, HttpResponse } from 'msw';

/** GitHub API contents URL pattern (matches any repo/path combination). */
const GITHUB_CONTENTS_URL =
  'https://api.github.com/repos/:owner/:repo/contents/:path';

/**
 * Returns a 403 with X-RateLimit-Remaining: 0 — the shape GitHub sends when
 * the authenticated request rate limit is exhausted.
 *
 * Usage: `server.use(githubRateLimitHandler)` to override for a single test.
 */
export const githubRateLimitHandler = http.get(
  GITHUB_CONTENTS_URL,
  () =>
    new HttpResponse(JSON.stringify({ message: 'API rate limit exceeded' }), {
      status: 403,
      headers: {
        'X-RateLimit-Remaining': '0',
        'Content-Type': 'application/json',
      },
    }),
);

/**
 * Returns a 404 for any GitHub contents request — simulates a missing path.
 *
 * Usage: `server.use(githubNotFoundHandler)` to override for a single test.
 */
export const githubNotFoundHandler = http.get(
  GITHUB_CONTENTS_URL,
  () => new HttpResponse(null, { status: 404 }),
);
