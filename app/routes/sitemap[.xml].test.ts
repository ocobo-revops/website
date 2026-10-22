/**
 * Loader tests for the sitemap route.
 *
 * Covers the observable behaviours of `loader` in `sitemap[.xml].tsx`:
 *  1. Returns an XML Response with the correct content-type.
 *  2. Static routes are always present in the output.
 *  3. Dynamic routes from stories, posts, and jobs are included.
 *  4. Draft/closed jobs are excluded; only published ones appear.
 *  5. Loader degrades gracefully when any content fetcher fails.
 *  6. All fetchers fire in parallel (no sequential awaiting).
 *  7. Challenge routes are listed in both languages, and none while the
 *     `challenges` flag is disabled.
 *
 * Uses the `invokeLoader` harness (`app/test/loader-harness.ts`).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { JobFrontmatter } from '~/modules/schemas';
import { invokeLoader } from '~/test/loader-harness';
import type {
  BlogpostFrontmatter,
  MarkdocFile,
  StoryFrontmatter,
} from '~/types';

const fetchStoriesMock = vi.fn();
const fetchBlogpostsMock = vi.fn();
const fetchJobsMock = vi.fn();
const fetchChallengesMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchStories: () => fetchStoriesMock(),
  fetchBlogposts: () => fetchBlogpostsMock(),
  fetchJobs: () => fetchJobsMock(),
}));

// The content barrel does not export the challenge fetchers: the route
// imports them from the API module, so both modules need a mock.
vi.mock('~/modules/content/api', () => ({
  fetchChallenges: (lang: string) => fetchChallengesMock(lang),
}));

function storyEntry(
  overrides: Partial<StoryFrontmatter> & { slug?: string } = {},
): MarkdocFile<StoryFrontmatter> {
  const { slug = 'acme', ...fm } = overrides;
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      name: 'Acme',
      date: '2024-03-15',
      title: 'Acme story',
      subtitle: 'sub',
      description: 'desc',
      speaker: 'Jane Doe',
      role: 'CRO',
      duration: '3 months',
      scopes: [],
      tools: [],
      quotes: ['Quote'],
      deliverables: [],
      ...fm,
    },
  };
}

function postEntry(
  overrides: Partial<BlogpostFrontmatter> & { slug?: string } = {},
): MarkdocFile<BlogpostFrontmatter> {
  const { slug = 'hello-world', ...fm } = overrides;
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      title: 'Hello world',
      description: 'desc',
      author: 'Jane',
      image: '/img.png',
      date: '2024-06-01',
      tags: [],
      read: '3 min',
      ...fm,
    },
  };
}

function jobEntry(
  overrides: Partial<JobFrontmatter> & { slug?: string } = {},
): MarkdocFile<JobFrontmatter> {
  const { slug = 'senior-revops', ...fm } = overrides;
  return {
    slug,
    content: null,
    markdown: '',
    frontmatter: {
      title: 'Senior RevOps',
      icon: 'briefcase',
      contractType: 'CDI',
      seniority: 'Senior',
      location: 'Paris',
      hiringContact: 'Jane',
      applyEmail: 'jobs@ocobo.co',
      status: 'published',
      publishedAt: '2024-09-01',
      intro: 'Join us',
      ...fm,
    },
  };
}

beforeEach(() => {
  // Challenges are disabled by default: enable every page.
  vi.stubEnv('DISABLED_PAGES', '');
  fetchChallengesMock.mockResolvedValue([200, 'success', []]);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  vi.resetModules();
});

describe('sitemap loader', () => {
  it('returns a Response with content-type application/xml', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.headers.get('content-type')).toBe(
      'application/xml',
    );
    const body = await outcome.response.text();
    expect(body).toContain('<?xml version="1.0"');
    expect(body).toContain('<urlset');
  });

  it('includes all static routes', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    const staticUrls = [
      'https://www.ocobo.co/fr',
      'https://www.ocobo.co/fr/offer',
      'https://www.ocobo.co/fr/method',
      'https://www.ocobo.co/fr/about-us',
      'https://www.ocobo.co/fr/contact',
      'https://www.ocobo.co/stories',
      'https://www.ocobo.co/blog',
      'https://www.ocobo.co/fr/jobs',
      'https://www.ocobo.co/legal/confidentialite',
      'https://www.ocobo.co/legal/cgu',
    ];
    for (const url of staticUrls) {
      expect(body).toContain(`<loc>${url}</loc>`);
    }
  });

  it('includes dynamic story routes from content fetcher', async () => {
    fetchStoriesMock.mockResolvedValue([
      200,
      'success',
      [storyEntry({ slug: 'acme', date: '2024-03-15' })],
    ]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/stories/acme</loc>');
  });

  it('includes dynamic blog post routes from content fetcher', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([
      200,
      'success',
      [postEntry({ slug: 'hello-world' })],
    ]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/blog/hello-world</loc>');
  });

  it('includes only published job routes', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([
      200,
      'success',
      [
        jobEntry({ slug: 'live-job', status: 'published' }),
        jobEntry({ slug: 'draft-job', status: 'draft' }),
        jobEntry({ slug: 'closed-job', status: 'closed' }),
      ],
    ]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/fr/jobs/live-job</loc>');
    expect(body).not.toContain('/fr/jobs/draft-job');
    expect(body).not.toContain('/fr/jobs/closed-job');
  });

  it('degrades gracefully when stories fetcher fails', async () => {
    fetchStoriesMock.mockResolvedValue([500, 'source_error', undefined]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/stories</loc>');
    expect(body).not.toContain('<loc>https://www.ocobo.co/stories/');
  });

  it('degrades gracefully when posts fetcher fails', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([500, 'source_error', undefined]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/blog</loc>');
    expect(body).not.toContain('<loc>https://www.ocobo.co/blog/');
  });

  it('degrades gracefully when jobs fetcher fails', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([500, 'source_error', undefined]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/fr/jobs</loc>');
    expect(body).not.toContain('<loc>https://www.ocobo.co/fr/jobs/');
  });

  it('includes challenge routes in both languages', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);
    fetchChallengesMock.mockImplementation(async (lang: string) => [
      200,
      'success',
      lang === 'fr'
        ? [
            { slug: 'revenue-performance' },
            { slug: 'revenue-ai' },
            { slug: 'Not_Kebab' },
          ]
        : [{ slug: 'revenue-performance' }],
    ]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(fetchChallengesMock).toHaveBeenCalledWith('fr');
    expect(fetchChallengesMock).toHaveBeenCalledWith('en');
    expect(body).toContain(
      '<loc>https://www.ocobo.co/fr/challenges/revenue-performance</loc>',
    );
    expect(body).toContain(
      '<loc>https://www.ocobo.co/fr/challenges/revenue-ai</loc>',
    );
    expect(body).toContain(
      '<loc>https://www.ocobo.co/en/challenges/revenue-performance</loc>',
    );
    expect(body).not.toContain(
      '<loc>https://www.ocobo.co/en/challenges/revenue-ai</loc>',
    );
    expect(body).not.toContain('Not_Kebab');
  });

  it('lists no challenge and skips the fetch when the flag is disabled', async () => {
    vi.stubEnv('DISABLED_PAGES', undefined);
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);
    fetchChallengesMock.mockResolvedValue([
      200,
      'success',
      [{ slug: 'revenue-performance' }],
    ]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(fetchChallengesMock).not.toHaveBeenCalled();
    expect(body).not.toContain('/challenges/');
  });

  it('degrades gracefully when the challenges fetcher fails', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);
    fetchChallengesMock.mockResolvedValue([500, 'source_error', undefined]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).toContain('<loc>https://www.ocobo.co/fr</loc>');
    expect(body).not.toContain('/challenges/');
  });

  it('fires all fetchers in parallel', async () => {
    let resolveStories!: (v: [number, string, unknown]) => void;
    let resolvePosts!: (v: [number, string, unknown]) => void;
    let resolveJobs!: (v: [number, string, unknown]) => void;

    fetchStoriesMock.mockReturnValue(
      new Promise<[number, string, unknown]>((r) => {
        resolveStories = r;
      }),
    );
    fetchBlogpostsMock.mockReturnValue(
      new Promise<[number, string, unknown]>((r) => {
        resolvePosts = r;
      }),
    );
    fetchJobsMock.mockReturnValue(
      new Promise<[number, string, unknown]>((r) => {
        resolveJobs = r;
      }),
    );

    const { loader } = await import('./sitemap[.xml]');
    const loaderPromise = invokeLoader(loader);

    await new Promise((r) => setImmediate(r));

    expect(fetchStoriesMock).toHaveBeenCalledTimes(1);
    expect(fetchBlogpostsMock).toHaveBeenCalledTimes(1);
    expect(fetchJobsMock).toHaveBeenCalledTimes(1);
    expect(fetchChallengesMock).toHaveBeenCalledTimes(2);

    resolveStories([200, 'success', []]);
    resolvePosts([200, 'success', []]);
    resolveJobs([200, 'success', []]);
    await loaderPromise;
  });
});
