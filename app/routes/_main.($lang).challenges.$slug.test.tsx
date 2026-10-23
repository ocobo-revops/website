/**
 * @vitest-environment jsdom
 *
 * Challenge page route (#233, #234, #235): the loader through the
 * `invokeLoader` harness, then the page with sections left out. The
 * cross-reference blocks resolve through the real
 * `resolveChallengeReferences`, from Stories, Tools and members built here.
 * The other challenges come from the `_main` layout data, as on the site.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  type ChallengeMenuEntry,
  MAIN_ROUTE_ID,
  toChallengeMenu,
} from '~/modules/challenge-menu';
import { buildChallengePage } from '~/modules/challenge-page';
import { buildChallengeReferenceSections } from '~/modules/challenge-reference-sections';
import type { ChallengeFrontmatter } from '~/modules/challenge-schema';
import {
  type ChallengeReferences,
  resolveChallengeReferences,
} from '~/modules/content/challenge-references';
import type { Member } from '~/modules/content/members';
import type { ToolRegistry } from '~/modules/content/tools';
import type { StoryFrontmatter } from '~/modules/schemas';
import { loadChallengeFixture } from '~/test/challenge-fixture';
import { invokeLoader } from '~/test/loader-harness';
import { render, screen } from '~/test/utils';
import type { MarkdocFile } from '~/types';

import ChallengeRoute, { loader } from './_main.($lang).challenges.$slug';

const fetchChallengeMock = vi.fn();
let loaderData: unknown;

vi.mock('~/modules/content/api', () => ({
  fetchChallenge: (...args: unknown[]) => fetchChallengeMock(...args),
}));

const references: ChallengeReferences = {
  clientCase: null,
  methodTools: [],
  partner: null,
  experts: [],
};
const loadChallengeReferencesMock = vi.fn(
  async (..._args: unknown[]): Promise<ChallengeReferences> => references,
);

vi.mock('~/modules/content/challenge-references', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('~/modules/content/challenge-references')
  >()),
  loadChallengeReferences: (...args: unknown[]) =>
    loadChallengeReferencesMock(...args),
}));

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: async (lang: string) => (key: string) => `${lang}:${key}`,
  },
}));

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useLoaderData: () => loaderData,
}));

const fixture = loadChallengeFixture('en', 'revenue-performance');
const frenchFixture = loadChallengeFixture('fr', 'revenue-performance');
// The English fixtures hold revenue-performance only.
const revenueAiFixture = loadChallengeFixture('fr', 'revenue-ai');

const tools: ToolRegistry = Object.fromEntries(
  ['hubspot', 'salesforce', 'clari'].map((slug) => [
    slug,
    { slug, name: `${slug} tool`, iconUrl: `https://blob/${slug}.svg` },
  ]),
);

const expert: Member = {
  slug: 'jane-doe',
  name: 'Jane Doe',
  role: { fr: 'Consultante RevOps', en: 'RevOps consultant' },
  track: 'builder',
  avatar: 'https://blob/jane.jpg',
  displayOrder: 1,
  active: true,
  bio: { fr: 'bio', en: 'bio' },
  featuredOnAboutUs: false,
  challenge: 'rp',
  contribution: {
    fr: 'Elle remet le forecast au centre.',
    en: 'She puts the forecast back at the centre.',
  },
  tools: ['hubspot', 'clari'],
  previousCompanies: ['Salesforce'],
};

const acmeStory: MarkdocFile<StoryFrontmatter> = {
  slug: 'acme',
  content: null,
  markdown: '',
  frontmatter: {
    name: 'Acme',
    date: '2025-01-01',
    title: 'Acme forecasts its quarter',
    subtitle: 'A number you can see coming',
    description: 'description',
    speaker: 'Jane Doe',
    role: 'CRO',
    duration: '3 months',
    scopes: [],
    tools: [],
    quotes: [],
    deliverables: [],
  },
};

const writtenCase: ChallengeFrontmatter['case'] = {
  story: 'acme',
  headline: 'Acme: a forecast within 5%.',
  summary: 'Six months to rebuild the pipeline review.',
  metrics: [
    { value: '+32%', label: 'Win rate' },
    { value: '5%', label: 'Forecast error' },
  ],
};

/** The references of `file`, its case linked to the Acme Story. */
function resolvedReferences({
  file = fixture,
  story = acmeStory,
  clientCase = writtenCase,
}: {
  file?: MarkdocFile<ChallengeFrontmatter>;
  story?: MarkdocFile<StoryFrontmatter> | null;
  clientCase?: ChallengeFrontmatter['case'];
} = {}): ChallengeReferences {
  return resolveChallengeReferences({
    slug: file.slug,
    challenge: { ...file.frontmatter, case: clientCase },
    story,
    tools,
    members: { [expert.slug]: expert },
  });
}

/** The `_main` navbar list, the current challenge included. */
const menu = toChallengeMenu([fixture, revenueAiFixture]);

beforeEach(() => {
  // Challenges are disabled by default: enable every page.
  vi.stubEnv('DISABLED_PAGES', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
  fetchChallengeMock.mockReset();
  loadChallengeReferencesMock.mockClear();
  vi.restoreAllMocks();
});

describe('challenge loader', () => {
  it('returns the French challenge for /fr/challenges/<slug>', async () => {
    fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr/challenges/revenue-performance',
      params: { lang: 'fr', slug: 'revenue-performance' },
    });

    expect(fetchChallengeMock).toHaveBeenCalledWith(
      'revenue-performance',
      'fr',
    );
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.lang).toBe('fr');
    expect(outcome.data.page.key).toBe('rp');
    expect(outcome.data.title).toBe('fr:meta.title');
  });

  it('returns the section view models of the references', async () => {
    fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/challenges/revenue-performance',
      params: { lang: 'en', slug: 'revenue-performance' },
    });

    expect(loadChallengeReferencesMock).toHaveBeenCalledWith(
      'revenue-performance',
      fixture.frontmatter,
      'en',
    );
    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.references).toEqual({
      methodTools: [],
      partner: null,
      clientCase: null,
      experts: [],
    });
  });

  it('returns the client case and experts of the page language only', async () => {
    fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);
    loadChallengeReferencesMock.mockResolvedValueOnce(resolvedReferences());

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/challenges/revenue-performance',
      params: { lang: 'en', slug: 'revenue-performance' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    const { clientCase, experts, methodTools } = outcome.data.references;
    expect(clientCase?.storySlug).toBe('acme');
    expect(experts).toEqual([
      {
        slug: 'jane-doe',
        name: 'Jane Doe',
        role: 'RevOps consultant',
        photo: 'https://blob/jane.jpg',
        contribution: 'She puts the forecast back at the centre.',
        tools: ['hubspot tool', 'clari tool'],
        previousCompanies: ['Salesforce'],
      },
    ]);
    expect(methodTools.map((tool) => tool.slug)).toEqual([
      'hubspot',
      'salesforce',
    ]);
  });

  it('fetches the English file for /en/challenges/<slug>', async () => {
    fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/challenges/revenue-performance',
      params: { lang: 'en', slug: 'revenue-performance' },
    });

    expect(fetchChallengeMock).toHaveBeenCalledWith(
      'revenue-performance',
      'en',
    );
    expect(outcome.type).toBe('data');
  });

  it('titles the page with the name alone when the tagline is a placeholder', async () => {
    fetchChallengeMock.mockResolvedValue([
      200,
      'success',
      {
        ...fixture,
        frontmatter: { ...fixture.frontmatter, tagline: '[Tagline]' },
      },
    ]);

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/en/challenges/revenue-performance',
      params: { lang: 'en', slug: 'revenue-performance' },
    });

    expect(outcome.type).toBe('data');
    if (outcome.type !== 'data') return;
    expect(outcome.data.title).toBe(fixture.frontmatter.name);
  });

  it('returns 404 when the file is missing', async () => {
    fetchChallengeMock.mockResolvedValue([404, 'not_found', undefined]);

    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr/challenges/unknown',
      params: { lang: 'fr', slug: 'unknown' },
    });

    expect(loadChallengeReferencesMock).not.toHaveBeenCalled();
    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  it('returns 404 for a slug that is not kebab-case, without fetching', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/fr/challenges/Revenue..',
      params: { lang: 'fr', slug: 'Revenue..' },
    });

    expect(fetchChallengeMock).not.toHaveBeenCalled();
    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(404);
  });

  describe('with the challenges flag disabled', () => {
    beforeEach(() => {
      vi.stubEnv('DISABLED_PAGES', undefined);
    });

    it('returns 404 without fetching', async () => {
      fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);

      const outcome = await invokeLoader(loader, {
        url: 'http://test.local/fr/challenges/revenue-performance',
        params: { lang: 'fr', slug: 'revenue-performance' },
      });

      expect(fetchChallengeMock).not.toHaveBeenCalled();
      expect(outcome.type).toBe('response');
      if (outcome.type !== 'response') return;
      expect(outcome.response.status).toBe(404);
    });

    it('returns 404 instead of redirecting /challenges/<slug>', async () => {
      const outcome = await invokeLoader(loader, {
        url: 'http://test.local/challenges/revenue-performance',
        params: { slug: 'revenue-performance' },
      });

      expect(outcome.type).toBe('response');
      if (outcome.type !== 'response') return;
      expect(outcome.response.status).toBe(404);
    });
  });

  it('redirects /challenges/<slug> to the French URL', async () => {
    const outcome = await invokeLoader(loader, {
      url: 'http://test.local/challenges/revenue-performance',
      params: { slug: 'revenue-performance' },
    });

    expect(outcome.type).toBe('response');
    if (outcome.type !== 'response') return;
    expect(outcome.response.status).toBe(301);
    expect(outcome.response.headers.get('Location')).toBe(
      '/fr/challenges/revenue-performance',
    );
  });
});

function renderPage(
  frontmatter: ChallengeFrontmatter,
  lang: 'fr' | 'en' = 'en',
  pageReferences: ChallengeReferences = references,
  /** `null` renders without the `_main` layout data. */
  challenges: ChallengeMenuEntry[] | null = [],
) {
  loaderData = {
    page: buildChallengePage(frontmatter),
    references: buildChallengeReferenceSections(pageReferences, lang),
    lang,
    slug: 'revenue-performance',
  };
  return render(<ChallengeRoute />, {
    initialEntries: [`/${lang}/challenges/revenue-performance`],
    i18nLang: lang,
    // The `:lang` param localises the links, as on the site.
    path: ':lang/challenges/:slug',
    loaderData: challenges
      ? { [MAIN_ROUTE_ID]: { challenges, failed: false } }
      : {},
  });
}

describe('challenge page', () => {
  it('renders the sections in order', () => {
    renderPage(fixture.frontmatter);

    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A number',
    );
    expect(headings).toEqual([
      'The number lives in the heads of a few people. Nowhere else.',
      'Who it is for',
      'What we build',
      'How we work',
      fixture.frontmatter.diagnostic.question,
    ]);
    const ctas = screen.getAllByRole('link', {
      name: 'Make my forecast reliable',
    });
    expect(ctas.map((cta) => cta.getAttribute('href'))).toEqual([
      '#diagnostic',
      '/en/contact',
    ]);
  });

  it('leaves out a section whose content is all placeholders', () => {
    const { frontmatter } = fixture;
    renderPage({
      ...frontmatter,
      symptoms: {
        ...frontmatter.symptoms,
        items: frontmatter.symptoms.items.map(() => '[Symptom]'),
      },
    });

    expect(screen.queryByText('Sounds familiar')).not.toBeInTheDocument();
    expect(screen.queryByText('[Symptom]')).not.toBeInTheDocument();
    expect(screen.getByText('Who it is for')).toBeInTheDocument();
  });

  it('links the secondary hero CTA to the workstreams', () => {
    renderPage(fixture.frontmatter);

    expect(screen.getByRole('link', { name: 'What we build' })).toHaveAttribute(
      'href',
      '#chantiers',
    );
    expect(document.getElementById('chantiers')).not.toBeNull();
    expect(
      screen.getAllByRole('button', { name: /^Flip card/ }).length,
    ).toBeGreaterThan(0);
  });

  it('drops the workstreams and their CTA when every deliverable is a placeholder', () => {
    const { frontmatter } = fixture;
    renderPage({
      ...frontmatter,
      workstreams: {
        ...frontmatter.workstreams,
        items: frontmatter.workstreams.items.map((item) => ({
          ...item,
          deliverable: '[Deliverable]',
        })),
      },
    });

    expect(document.getElementById('chantiers')).toBeNull();
    expect(
      screen.queryByRole('link', { name: 'What we build' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('How we work')).toBeInTheDocument();
  });

  it('drops the method when every step text is a placeholder', () => {
    const { frontmatter } = fixture;
    renderPage({
      ...frontmatter,
      method: {
        ...frontmatter.method,
        steps: frontmatter.method.steps.map((step) => ({
          ...step,
          text: '[Step]',
        })),
      },
    });

    expect(screen.queryByText('How we work')).not.toBeInTheDocument();
    expect(screen.queryByText('[Step]')).not.toBeInTheDocument();
  });

  it('drops the hero CTA when the diagnostic block is absent', () => {
    const { frontmatter } = fixture;
    renderPage({
      ...frontmatter,
      diagnostic: { ...frontmatter.diagnostic, question: '[Question]' },
    });

    expect(document.getElementById('diagnostic')).toBeNull();
    expect(
      screen.queryByRole('link', { name: 'Make my forecast reliable' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('[Question]')).not.toBeInTheDocument();
    // The workstreams CTA stays, alone and secondary.
    expect(screen.getByRole('link', { name: 'What we build' })).toHaveAttribute(
      'href',
      '#chantiers',
    );
  });

  it('renders the French file with the French labels', () => {
    renderPage(frenchFixture.frontmatter, 'fr');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      frenchFixture.frontmatter.hero.title[0],
    );
    expect(screen.getByText('Vous vous reconnaissez')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Pour qui' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Comment nous travaillons',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { level: 3, name: 'Diagnostic' }),
    ).toHaveLength(1);
  });

  it('keeps the file override of the method headings', () => {
    const revenueAi = loadChallengeFixture('fr', 'revenue-ai');
    renderPage(revenueAi.frontmatter, 'fr');

    expect(
      screen.getByRole('heading', { level: 2, name: 'Le Revenue AI Sprint' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Comment nous travaillons' }),
    ).not.toBeInTheDocument();
  });

  it('keeps an h1 when the hero title is a placeholder', () => {
    const { frontmatter } = fixture;
    renderPage({
      ...frontmatter,
      hero: { ...frontmatter.hero, title: ['[Title]', 'second line'] },
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      frontmatter.name,
    );
  });
});

describe('challenge page cross-references', () => {
  it('renders the method tools, client case, experts and other challenges', () => {
    renderPage(fixture.frontmatter, 'en', resolvedReferences(), menu);

    expect(
      screen
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'The number lives in the heads of a few people. Nowhere else.',
      'Who it is for',
      'What we build',
      'How we work',
      'Acme: a forecast within 5%.',
      'The Ocobo experts on this challenge.',
      fixture.frontmatter.diagnostic.question,
      'Other challenges',
    ]);
    expect(screen.getByAltText('hubspot tool')).toBeInTheDocument();
    expect(screen.getByText('Client case')).toBeInTheDocument();
    expect(screen.getByText('+32%')).toBeInTheDocument();
    expect(screen.getByText('Forecast error')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Read the client case' }),
    ).toHaveAttribute('href', '/en/clients/acme');
    expect(
      screen.getByRole('heading', { level: 3, name: 'Jane Doe' }),
    ).toBeInTheDocument();
    expect(screen.getByText('RevOps consultant')).toBeInTheDocument();
    expect(screen.getByText('Revenue Performance expert')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Talk to one of them' }),
    ).toHaveAttribute('href', '#diagnostic');
    const otherLinks = screen
      .getAllByRole('link')
      .filter((link) =>
        link.getAttribute('href')?.startsWith('/en/challenges/'),
      );
    // The current challenge is not listed.
    expect(otherLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/en/challenges/revenue-ai',
    ]);
    expect(otherLinks[0]).toHaveTextContent(revenueAiFixture.frontmatter.name);
  });

  it('hides the other challenges without the layout data', () => {
    renderPage(fixture.frontmatter, 'en', resolvedReferences(), null);

    expect(
      screen.queryByRole('heading', { name: 'Other challenges' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Acme: a forecast within 5%.' }),
    ).toBeInTheDocument();
  });

  it('hides only the client case when its Story reference is broken', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    renderPage(
      fixture.frontmatter,
      'en',
      resolvedReferences({ story: null }),
      menu,
    );

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('case.story "acme" did not resolve'),
    );
    expect(screen.queryByText('Client case')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'The Ocobo experts on this challenge.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Other challenges' }),
    ).toBeInTheDocument();
  });

  it('leaves out each block whose data is missing', () => {
    renderPage(fixture.frontmatter);

    expect(screen.queryByText('Client case')).not.toBeInTheDocument();
    expect(document.getElementById('experts')).toBeNull();
    expect(
      screen.queryByRole('heading', { name: 'Other challenges' }),
    ).not.toBeInTheDocument();
  });

  it('leaves out the client case while its texts are mockup templates', () => {
    renderPage(
      fixture.frontmatter,
      'en',
      resolvedReferences({
        clientCase: { ...fixture.frontmatter.case, story: undefined },
      }),
    );

    expect(screen.queryByText('Client case')).not.toBeInTheDocument();
    expect(
      screen.queryByText(fixture.frontmatter.case.headline),
    ).not.toBeInTheDocument();
    expect(document.getElementById('experts')).not.toBeNull();
  });

  it('drops the experts CTA when the diagnostic block is absent', () => {
    const { frontmatter } = fixture;
    renderPage(
      {
        ...frontmatter,
        diagnostic: { ...frontmatter.diagnostic, question: '[Question]' },
      },
      'en',
      resolvedReferences(),
    );

    expect(document.getElementById('experts')).not.toBeNull();
    expect(
      screen.queryByRole('link', { name: 'Talk to one of them' }),
    ).not.toBeInTheDocument();
  });

  it('renders the French labels and role', () => {
    renderPage(
      frenchFixture.frontmatter,
      'fr',
      resolvedReferences({ file: frenchFixture }),
      menu,
    );

    expect(screen.getByText('Cas client')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Lire le cas client' }),
    ).toHaveAttribute('href', '/fr/clients/acme');
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Les experts Ocobo de cet enjeu.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Consultante RevOps')).toBeInTheDocument();
    expect(screen.getByText('Expert Revenue Performance')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Les autres enjeux' }),
    ).toBeInTheDocument();
  });
});
