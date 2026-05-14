import { http, HttpResponse } from 'msw';

/** GitHub API contents URL pattern (matches any repo/path combination). */
const GITHUB_CONTENTS_URL =
  'https://api.github.com/repos/:owner/:repo/contents/:path';

/**
 * Returns a 403 + X-RateLimit-Remaining: 0 response — the shape GitHub sends
 * when the authenticated request rate limit is exhausted.
 */
export const githubRateLimitHandler = http.get(
  GITHUB_CONTENTS_URL,
  ({ request }) => {
    const remaining = request.headers.get('X-RateLimit-Remaining');
    if (remaining === '0') {
      return new HttpResponse(null, {
        status: 403,
        headers: { 'X-RateLimit-Remaining': '0' },
      });
    }
    return HttpResponse.json([]);
  },
);

/**
 * Returns a 404 for any GitHub contents request — simulates a missing path.
 */
export const githubNotFoundHandler = http.get(
  GITHUB_CONTENTS_URL,
  () => new HttpResponse(null, { status: 404 }),
);
