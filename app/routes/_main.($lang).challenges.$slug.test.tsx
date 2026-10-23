/**
 * @vitest-environment jsdom
 *
 * Challenge page route (#233, #234, #236): the loader through the
 * `invokeLoader` harness, then the page with sections left out.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildChallengePage } from '~/modules/challenge-page';
import type { ChallengeFrontmatter } from '~/modules/challenge-schema';
import type {
  ChallengePartner,
  ChallengeReferences,
} from '~/modules/content/challenge-references';
import { loadChallengeFixture } from '~/test/challenge-fixture';
import { invokeLoader } from '~/test/loader-harness';
import { render, screen } from '~/test/utils';

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
  otherChallenges: [],
};
const loadChallengeReferencesMock = vi.fn(
  async (..._args: unknown[]) => references,
);

vi.mock('~/modules/content/challenge-references', () => ({
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

beforeEach(() => {
  // Challenges are disabled by default: enable every page.
  vi.stubEnv('DISABLED_PAGES', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
  fetchChallengeMock.mockReset();
  loadChallengeReferencesMock.mockClear();
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

  it('returns the resolved references of the challenge', async () => {
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
    expect(outcome.data.references).toEqual(references);
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

const qobra: ChallengePartner = {
  tool: { slug: 'qobra', name: 'Qobra' },
  sentence: 'Commissions computed on their own.',
  metrics: [{ before: '7 days', after: '1', label: 'to close commissions' }],
  source: 'Figures published by Qobra.',
};

const revenueAi: ChallengeReferences['otherChallenges'][number] = {
  slug: 'revenue-ai',
  key: 'ai',
  order: 6,
  name: 'Revenue AI',
  tagline: 'AI on a system that works',
};

function renderPage(
  frontmatter: ChallengeFrontmatter,
  lang: 'fr' | 'en' = 'en',
  pageReferences: Partial<ChallengeReferences> = {},
) {
  loaderData = {
    page: buildChallengePage(frontmatter),
    references: { ...references, ...pageReferences },
  };
  return render(<ChallengeRoute />, {
    initialEntries: [`/${lang}/challenges/revenue-performance`],
    i18nLang: lang,
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
      fixture.frontmatter.aiBridge.title,
      'How we work',
      fixture.frontmatter.diagnostic.question,
    ]);
    const ctas = screen.getAllByRole('link', {
      name: 'Make my forecast reliable',
    });
    // The test router has no `:lang` param, so the contact URL is French.
    expect(ctas.map((cta) => cta.getAttribute('href'))).toEqual([
      '#diagnostic',
      '/fr/contact',
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

  describe('AI bridge and partner (#236)', () => {
    it('leaves both out when the file has neither', () => {
      const { frontmatter } = fixture;
      renderPage({
        ...frontmatter,
        aiBridge: { ...frontmatter.aiBridge, title: '[Title]' },
      });

      expect(
        screen.queryByText('What AI changes here'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('[Title]')).not.toBeInTheDocument();
      expect(screen.queryByText('With')).not.toBeInTheDocument();
    });

    it('renders the agent window and links to the Revenue AI page', () => {
      renderPage(frenchFixture.frontmatter, 'fr', {
        otherChallenges: [revenueAi],
      });

      expect(screen.getByText("Ce que l'IA change ici")).toBeInTheDocument();
      expect(
        screen.getByRole('figure', {
          name: 'Exemple de message\u00a0: Agent Forecast',
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: "Déployer l'IA dans vos équipes" }),
      ).toHaveAttribute('href', '/fr/challenges/revenue-ai');
    });

    it('renders the section without a window and with no link to itself on the AI page', () => {
      const ai = loadChallengeFixture('fr', 'revenue-ai');
      renderPage(ai.frontmatter, 'fr', { otherChallenges: [revenueAi] });

      expect(screen.getByText('Notre point de vue')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: ai.frontmatter.aiBridge.title,
        }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('figure', { name: /^Exemple de message/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: "Déployer l'IA dans vos équipes" }),
      ).not.toBeInTheDocument();
    });

    it('renders the English labels', () => {
      renderPage(fixture.frontmatter, 'en', { otherChallenges: [revenueAi] });

      expect(screen.getByText('What AI changes here')).toBeInTheDocument();
      // The test router has no `:lang` param, so the link is French.
      expect(
        screen.getByRole('link', { name: 'Deploy AI in your teams' }),
      ).toHaveAttribute('href', '/fr/challenges/revenue-ai');
    });

    it('closes the workstreams with the partner and its source', () => {
      renderPage(fixture.frontmatter, 'en', { partner: qobra });

      const workstreams = document.getElementById('chantiers');
      expect(workstreams).toHaveTextContent(
        'Commissions computed on their own.',
      );
      expect(workstreams).toHaveTextContent('Figures published by Qobra.');
    });

    it('keeps the partner when the workstreams are absent', () => {
      const { frontmatter } = fixture;
      renderPage(
        {
          ...frontmatter,
          workstreams: {
            ...frontmatter.workstreams,
            items: frontmatter.workstreams.items.map((item) => ({
              ...item,
              deliverable: '[Deliverable]',
            })),
          },
        },
        'en',
        { partner: qobra },
      );

      expect(document.getElementById('chantiers')).toBeNull();
      expect(
        screen.getByText('Figures published by Qobra.'),
      ).toBeInTheDocument();
    });

    it('drops a partner with a placeholder source in the loader', async () => {
      fetchChallengeMock.mockResolvedValue([200, 'success', fixture]);
      loadChallengeReferencesMock.mockResolvedValueOnce({
        ...references,
        partner: { ...qobra, source: '[Source]' },
      });

      const outcome = await invokeLoader(loader, {
        url: 'http://test.local/en/challenges/revenue-performance',
        params: { lang: 'en', slug: 'revenue-performance' },
      });

      expect(outcome.type).toBe('data');
      if (outcome.type !== 'data') return;
      expect(outcome.data.references.partner).toBeNull();
    });
  });
});
