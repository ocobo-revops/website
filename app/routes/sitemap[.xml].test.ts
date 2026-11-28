/**
 * Loader tests for the sitemap route.
 *
 * Covers the observable behaviours of `loader` in `sitemap[.xml].tsx`:
 *  1. Returns an XML Response with the correct content-type.
 *  2. Static routes are listed in both languages, behind their flags.
 *  3. Dynamic routes from stories, posts, and jobs are included.
 *  4. Draft/closed jobs are excluded; only published ones appear.
 *  5. Loader degrades gracefully when any content fetcher fails.
 *  6. All fetchers fire in parallel (no sequential awaiting).
 *  7. Challenge routes are listed in both languages.
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
const loadChallengeMenuMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchStories: (lang?: string) => fetchStoriesMock(lang),
  fetchBlogposts: () => fetchBlogpostsMock(),
  fetchJobs: (lang?: string) => fetchJobsMock(lang),
}));

// The challenge list comes from the navbar loader module, which skips
// invalid files and caches (tested in `challenge-menu.server.test.ts`).
vi.mock('~/modules/challenge-menu.server', () => ({
  loadChallengeMenu: (lang: string, options: unknown) =>
    loadChallengeMenuMock(lang, options),
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
  loadChallengeMenuMock.mockResolvedValue({ challenges: [], failed: false });
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

  it('lists the static pages of each language that has them', async () => {
    fetchStoriesMock.mockImplementation(async (lang: string) =>
      lang === 'fr'
        ? [200, 'success', [storyEntry()]]
        : [404, 'not_found', undefined],
    );
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockImplementation(async (lang: string) =>
      lang === 'fr'
        ? [200, 'success', [jobEntry()]]
        : [404, 'not_found', undefined],
    );

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    const everyLanguage = [
      '',
      '/offer',
      '/method',
      '/studio',
      '/technology',
      '/about-us',
      '/contact',
    ];
    for (const lang of ['fr', 'en']) {
      for (const path of everyLanguage) {
        expect(body).toContain(
          `<loc>https://www.ocobo.co/${lang}${path}</loc>`,
        );
      }
    }
    for (const path of [
      '/clients',
      '/jobs',
      '/legal/confidentialite',
      '/legal/cgu',
    ]) {
      expect(body).toContain(`<loc>https://www.ocobo.co/fr${path}</loc>`);
      expect(body).not.toContain(`<loc>https://www.ocobo.co/en${path}</loc>`);
    }
    expect(body).toContain('<loc>https://www.ocobo.co/blog</loc>');
    expect(body).not.toContain('/stories');
  });

  it('leaves out pages whose feature flag is off', async () => {
    vi.stubEnv('DISABLED_PAGES', 'studio,technology,jobs');
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', [jobEntry()]]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).not.toContain('/studio');
    expect(body).not.toContain('/technology');
    expect(body).not.toContain('/jobs');
    expect(body).toContain('<loc>https://www.ocobo.co/fr/offer</loc>');
  });

  it('includes dynamic story routes from content fetcher', async () => {
    fetchStoriesMock.mockImplementation(async (lang: string) => [
      200,
      'success',
      lang === 'fr' ? [storyEntry({ slug: 'acme', date: '2024-03-15' })] : [],
    ]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(fetchStoriesMock).toHaveBeenCalledWith('fr');
    expect(fetchStoriesMock).toHaveBeenCalledWith('en');
    expect(body).toContain('<loc>https://www.ocobo.co/fr/clients/acme</loc>');
    expect(body).not.toContain('/en/clients/acme');
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
    expect(body).toContain('<loc>https://www.ocobo.co/en/jobs/live-job</loc>');
    expect(body).not.toContain('/jobs/draft-job');
    expect(body).not.toContain('/jobs/closed-job');
  });

  it('degrades gracefully when stories fetcher fails', async () => {
    fetchStoriesMock.mockResolvedValue([500, 'source_error', undefined]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(body).not.toContain('/clients');
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

    expect(body).not.toContain('/jobs');
  });

  it('includes challenge routes in both languages', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);
    loadChallengeMenuMock.mockImplementation(async (lang: string) => ({
      challenges:
        lang === 'fr'
          ? [{ slug: 'revenue-performance' }, { slug: 'revenue-ai' }]
          : [{ slug: 'revenue-performance' }],
      failed: false,
    }));

    const { loader } = await import('./sitemap[.xml]');
    const outcome = await invokeLoader(loader);

    if (outcome.type !== 'response') throw new Error('expected response');
    const body = await outcome.response.text();

    expect(loadChallengeMenuMock).toHaveBeenCalledWith('fr', {
      refresh: false,
    });
    expect(loadChallengeMenuMock).toHaveBeenCalledWith('en', {
      refresh: false,
    });
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
  });

  it('passes ?refresh=1 to the challenge list', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);

    const { loader } = await import('./sitemap[.xml]');
    await invokeLoader(loader, {
      url: 'http://test.local/sitemap.xml?refresh=1',
    });

    expect(loadChallengeMenuMock).toHaveBeenCalledWith('fr', {
      refresh: true,
    });
  });

  it('degrades gracefully when the challenge list is empty', async () => {
    fetchStoriesMock.mockResolvedValue([200, 'success', []]);
    fetchBlogpostsMock.mockResolvedValue([200, 'success', []]);
    fetchJobsMock.mockResolvedValue([200, 'success', []]);
    loadChallengeMenuMock.mockResolvedValue({ challenges: [], failed: false });

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

    expect(fetchStoriesMock).toHaveBeenCalledTimes(2);
    expect(fetchBlogpostsMock).toHaveBeenCalledTimes(1);
    expect(fetchJobsMock).toHaveBeenCalledTimes(2);
    expect(loadChallengeMenuMock).toHaveBeenCalledTimes(2);

    resolveStories([200, 'success', []]);
    resolvePosts([200, 'success', []]);
    resolveJobs([200, 'success', []]);
    await loaderPromise;
  });
});
