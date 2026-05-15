/**
 * Loader tests for the jobs detail route.
 *
 * Covers the observable behaviours of `loader` in `_main.($lang).jobs.$slug.tsx`:
 *  1. Redirect to `/{lang}/jobs` when slug is missing (FR and EN)
 *  2. Redirect when `fetchJob` returns a non-200 status
 *  3. Redirect when job status is `draft`
 *  4. Redirect when job status is `closed`
 *  5. Happy path FR: returns job data with correct lang and slug
 *  6. Happy path EN: same with lang param `en`
 *
 * Uses the `invokeLoader` harness (`app/test/loader-harness.ts`).
 */

import type { RenderableTreeNode } from '@markdoc/markdoc';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { JobFrontmatter } from '~/modules/schemas';
import { invokeLoader } from '~/test/loader-harness';
import type { MarkdocFile } from '~/types';

const fetchJobMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const resolveMemberMock = vi.fn();
const extractJobSectionsMock = vi.fn();
const buildJobPostingLdMock = vi.fn();
const serializeJsonLdMock = vi.fn();

vi.mock('~/modules/content', () => ({
  fetchJob: (...args: unknown[]) => fetchJobMock(...args),
  loadMemberRegistry: () => loadMemberRegistryMock(),
  resolveMember: (...args: unknown[]) => resolveMemberMock(...args),
  extractJobSections: (...args: unknown[]) => extractJobSectionsMock(...args),
  buildJobPostingLd: (...args: unknown[]) => buildJobPostingLdMock(...args),
  serializeJsonLd: (...args: unknown[]) => serializeJsonLdMock(...args),
}));

function jobEntry(
  overrides: Partial<JobFrontmatter> & { slug?: string } = {},
): MarkdocFile<JobFrontmatter> {
  const { slug = 'revops-consultant', ...frontmatterOverrides } = overrides;
  return {
    slug,
    content: null as unknown as RenderableTreeNode,
    markdown: '## Mission\n\nLead RevOps projects.',
    frontmatter: {
      title: 'RevOps Consultant',
      icon: 'briefcase',
      contractType: 'CDI',
      seniority: 'Senior',
      location: 'Paris',
      hiringContact: 'jerome-boileux',
      applyEmail: 'careers@ocobo.com',
      status: 'published',
      publishedAt: '2024-01-15',
      intro: 'Join our growing RevOps team.',
      ...frontmatterOverrides,
    },
  };
}

const fakeSections = {
  mission: [],
  responsabilites: [],
  profil: [],
};

afterEach(() => {
  fetchJobMock.mockReset();
  loadMemberRegistryMock.mockReset();
  resolveMemberMock.mockReset();
  extractJobSectionsMock.mockReset();
  buildJobPostingLdMock.mockReset();
  serializeJsonLdMock.mockReset();
});

describe('jobs detail loader', () => {
  it('redirects to /fr/jobs when slug is missing', async () => {
    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, { params: {} });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get('Location')).toBe('/fr/jobs');
  });

  it('redirects to /en/jobs when slug is missing and lang is en', async () => {
    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/jobs/missing',
      params: { lang: 'en' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get('Location')).toBe('/en/jobs');
  });

  it('redirects to /fr/jobs when fetchJob returns non-200', async () => {
    fetchJobMock.mockResolvedValueOnce([404, 'not_found', undefined]);
    loadMemberRegistryMock.mockResolvedValueOnce({});

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/jobs/missing',
      params: { slug: 'missing' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get('Location')).toBe('/fr/jobs');
  });

  it('redirects when job status is draft', async () => {
    const job = jobEntry({ status: 'draft' });
    fetchJobMock.mockResolvedValueOnce([200, 'success', job]);
    loadMemberRegistryMock.mockResolvedValueOnce({});

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/jobs/revops-consultant',
      params: { slug: 'revops-consultant' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get('Location')).toBe('/fr/jobs');
  });

  it('redirects when job status is closed', async () => {
    const job = jobEntry({ status: 'closed' });
    fetchJobMock.mockResolvedValueOnce([200, 'success', job]);
    loadMemberRegistryMock.mockResolvedValueOnce({});

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/jobs/revops-consultant',
      params: { slug: 'revops-consultant' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(302);
    expect(outcome.response.headers.get('Location')).toBe('/fr/jobs');
  });

  it('returns job data with lang and slug on happy path (FR)', async () => {
    const job = jobEntry();
    fetchJobMock.mockResolvedValueOnce([200, 'success', job]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractJobSectionsMock.mockReturnValueOnce(fakeSections);
    buildJobPostingLdMock.mockReturnValueOnce({});
    serializeJsonLdMock.mockReturnValueOnce('{}');

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/jobs/revops-consultant',
      params: { slug: 'revops-consultant' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const data = outcome.data as unknown as {
      job: typeof job;
      sections: typeof fakeSections;
      lang: string;
      slug: string;
      ld: string;
    };
    expect(data.job).toBe(job);
    expect(data.lang).toBe('fr');
    expect(data.slug).toBe('revops-consultant');
    expect(data.sections).toBe(fakeSections);
    expect(data.ld).toBe('{}');
  });

  it('throws 404 when lang param is invalid', async () => {
    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      params: { slug: 'test', lang: 'de' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('returns contact as a deferred promise that resolves to the resolved member', async () => {
    const job = jobEntry();
    const resolvedContact = {
      slug: 'jerome-boileux',
      name: 'Jérôme Boileux',
      role: 'Founder',
    };
    fetchJobMock.mockResolvedValueOnce([200, 'success', job]);
    loadMemberRegistryMock.mockResolvedValueOnce({
      'jerome-boileux': resolvedContact,
    });
    resolveMemberMock.mockReturnValueOnce(resolvedContact);
    extractJobSectionsMock.mockReturnValueOnce(fakeSections);
    buildJobPostingLdMock.mockReturnValueOnce({});
    serializeJsonLdMock.mockReturnValueOnce('{}');

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/jobs/revops-consultant',
      params: { slug: 'revops-consultant' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const data = outcome.data as { contact: unknown; ld: string };
    expect(data.contact).toBeInstanceOf(Promise);
    await expect(data.contact).resolves.toEqual(resolvedContact);
    // ld stays sync — crawlers need JSON-LD on critical path
    expect(typeof data.ld).toBe('string');
  });

  it('returns job data with lang=en on happy path (EN)', async () => {
    const job = jobEntry();
    fetchJobMock.mockResolvedValueOnce([200, 'success', job]);
    loadMemberRegistryMock.mockResolvedValueOnce({});
    resolveMemberMock.mockReturnValueOnce(null);
    extractJobSectionsMock.mockReturnValueOnce(fakeSections);
    buildJobPostingLdMock.mockReturnValueOnce({});
    serializeJsonLdMock.mockReturnValueOnce('{}');

    const { loader } = await import('./_main.($lang).jobs.$slug');
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/jobs/revops-consultant',
      params: { lang: 'en', slug: 'revops-consultant' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const data = outcome.data as { lang: string };
    expect(data.lang).toBe('en');
    expect(fetchJobMock).toHaveBeenCalledWith('revops-consultant', 'en');
  });
});
