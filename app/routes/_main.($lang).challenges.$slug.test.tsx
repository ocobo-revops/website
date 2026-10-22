/**
 * @vitest-environment jsdom
 *
 * Challenge page route (#233): the loader through the `invokeLoader`
 * harness, then the page with sections left out.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildChallengePage } from '~/modules/challenge-page';
import type { ChallengeFrontmatter } from '~/modules/challenge-schema';
import { loadChallengeFixture } from '~/test/challenge-fixture';
import { invokeLoader } from '~/test/loader-harness';
import { render, screen } from '~/test/utils';

import ChallengeRoute, { loader } from './_main.($lang).challenges.$slug';

const fetchChallengeMock = vi.fn();
let loaderData: unknown;

vi.mock('~/modules/content/api', () => ({
  fetchChallenge: (...args: unknown[]) => fetchChallengeMock(...args),
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

afterEach(() => {
  fetchChallengeMock.mockReset();
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
) {
  loaderData = { page: buildChallengePage(frontmatter) };
  return render(<ChallengeRoute />, {
    initialEntries: [`/${lang}/challenges/revenue-performance`],
    i18nLang: lang,
  });
}

describe('challenge page', () => {
  it('renders the four sections in order', () => {
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
