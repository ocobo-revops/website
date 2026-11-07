/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest';

import type { NavItem } from '~/components/navbar/types';
import type { ChallengeMenuEntry } from '~/modules/challenge-menu';
import { type PageSlug, getDisabledPages } from '~/modules/feature-flags';
import { render, screen } from '~/test/utils';

import { placeChallengeItem, useMenuItems } from './useMenuItems';

const offer: NavItem = { key: 'offer', label: 'Notre offre', path: '/offer' };
const stories: NavItem = { key: 'stories', label: 'Stories', path: '/clients' };
const contact: NavItem = {
  key: 'contact',
  label: 'Contact',
  path: '/contact',
  isButton: true,
};
const challenges: NavItem = {
  key: 'challenges',
  label: 'Vos enjeux',
  path: null,
  dropdown: [
    {
      key: 'challenge-revenue-performance',
      label: 'Revenue Performance',
      path: '/challenges/revenue-performance',
      color: 'yellow',
    },
  ],
};

describe('placeChallengeItem', () => {
  it('puts the challenge entry in the place of the offer entry', () => {
    const items = placeChallengeItem([offer, stories, contact], challenges);

    expect(items.map((item) => item.key)).toEqual([
      'challenges',
      'stories',
      'contact',
    ]);
    expect(items[0]).toBe(challenges);
  });

  it('keeps the offer entry when no challenge is published', () => {
    const items = [offer, stories, contact];

    expect(placeChallengeItem(items, null)).toEqual([offer, stories, contact]);
  });

  it('keeps the challenge entry, first, when there is no offer entry', () => {
    const items = placeChallengeItem([stories, contact], challenges);

    expect(items.map((item) => item.key)).toEqual([
      'challenges',
      'stories',
      'contact',
    ]);
  });

  it('does not mutate the given list', () => {
    const items = [offer, stories];

    placeChallengeItem(items, challenges);

    expect(items).toEqual([offer, stories]);
  });
});

/**
 * Renders the menu as JSON, so the tests read the hook's return value.
 * Serialisation drops the `icon` components, so icons are not covered here.
 */
function MenuProbe() {
  const items = useMenuItems();
  return <pre data-testid="menu">{JSON.stringify(items)}</pre>;
}

const revenuePerformance: ChallengeMenuEntry = {
  slug: 'revenue-performance',
  key: 'rp',
  name: 'Revenue Performance',
  tagline: 'Un chiffre que vous voyez venir',
};
const revenueAi: ChallengeMenuEntry = {
  slug: 'revenue-ai',
  key: 'ai',
  name: 'Revenue AI',
  tagline: 'Une IA qui travaille pour vos équipes Revenue',
};

type MenuOptions = {
  challenges?: ChallengeMenuEntry[];
  disabledPages?: PageSlug[];
  lang?: 'fr' | 'en';
};

function renderMenu({
  challenges = [revenuePerformance, revenueAi],
  disabledPages = ['roi'],
  lang = 'fr',
}: MenuOptions = {}): NavItem[] {
  render(<MenuProbe />, {
    loaderData: {
      root: { disabledPages },
      'routes/_main': { challenges, failed: false },
    },
    ...(lang === 'en'
      ? { i18nLang: 'en', initialEntries: ['/en'], path: ':lang/*' }
      : {}),
  });
  return JSON.parse(screen.getByTestId('menu').textContent ?? '[]');
}

const keysOf = (items: readonly { key: string }[] | undefined) =>
  (items ?? []).map((item) => item.key);

const find = (items: NavItem[], key: string) =>
  items.find((item) => item.key === key);

describe('useMenuItems', () => {
  it('follows the prototype order, IA after À propos', () => {
    expect(keysOf(renderMenu())).toEqual([
      'challenges',
      'method',
      'stories',
      'company',
      'ai',
      'resources',
      'contact',
    ]);
  });

  it('links IA to the Revenue AI challenge page', () => {
    const ai = find(renderMenu(), 'ai');

    expect(ai).toMatchObject({
      label: 'IA',
      path: '/fr/challenges/revenue-ai',
    });
    expect(ai?.dropdown).toBeUndefined();
  });

  it('hides IA when the Revenue AI challenge is not published', () => {
    const items = renderMenu({ challenges: [revenuePerformance] });

    expect(keysOf(items)).toEqual([
      'challenges',
      'method',
      'stories',
      'company',
      'resources',
      'contact',
    ]);
  });

  it('keeps the offer entry first and no IA when no challenge is published', () => {
    const items = renderMenu({ challenges: [] });

    expect(keysOf(items)).toEqual([
      'offer',
      'method',
      'stories',
      'company',
      'resources',
      'contact',
    ]);
  });

  it('lists the ROI calculator in Ressources when the roi page is on', () => {
    const resources = find(renderMenu({ disabledPages: [] }), 'resources');

    expect(keysOf(resources?.dropdown)).toEqual([
      'podcasts',
      'youtube',
      'blog',
      'roi',
      'club',
    ]);
    expect(
      resources?.dropdown?.find((item) => item.key === 'roi'),
    ).toMatchObject({
      label: 'Calculateur de ROI',
      description: "Cinq chiffres pour chiffrer l'effet RevOps.",
      path: '/fr/roi',
      shouldHide: false,
    });
  });

  it('hides the ROI calculator while the roi page is off', () => {
    const resources = find(renderMenu({ disabledPages: ['roi'] }), 'resources');

    expect(
      resources?.dropdown?.find((item) => item.key === 'roi')?.shouldHide,
    ).toBe(true);
  });

  describe('with the production DISABLED_PAGES value', () => {
    const originalEnv = process.env.DISABLED_PAGES;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.DISABLED_PAGES;
      } else {
        process.env.DISABLED_PAGES = originalEnv;
      }
    });

    it('hides the ROI calculator until its page exists (#248)', () => {
      process.env.DISABLED_PAGES = 'news,tools';
      const resources = find(
        renderMenu({ disabledPages: getDisabledPages() }),
        'resources',
      );

      expect(
        resources?.dropdown?.find((item) => item.key === 'roi')?.shouldHide,
      ).toBe(true);
    });
  });

  it('carries the prototype labels in French', () => {
    const items = renderMenu();

    expect(items.map((item) => item.label)).toEqual([
      'Vos enjeux',
      'Méthode',
      'Clients',
      'À propos',
      'IA',
      'Ressources',
      'Échanger avec un architecte',
    ]);
    expect(find(items, 'contact')?.path).toBe('/fr/contact');
    expect(
      find(items, 'method')?.dropdown?.map(({ label, path }) => [label, path]),
    ).toEqual([
      ['Méthodologie', '/fr/method'],
      ['Technologie', '/fr/technology'],
      ['Équipe', '/fr/studio'],
    ]);
    expect(
      find(items, 'company')?.dropdown?.map((item) => item.description),
    ).toEqual([
      "Notre mission, le manifeste et l'équipe fondatrice.",
      'Postes ouverts et processus de recrutement.',
    ]);
  });

  it('carries the translated labels in English', () => {
    const items = renderMenu({ lang: 'en' });

    expect(items.map((item) => item.label)).toEqual([
      'Your challenges',
      'Method',
      'Clients',
      'About',
      'AI',
      'Resources',
      'Talk to an architect',
    ]);
    expect(find(items, 'ai')?.path).toBe('/en/challenges/revenue-ai');
    expect(keysOf(find(items, 'method')?.dropdown)).toEqual([
      'framework',
      'technology',
      'studio',
    ]);
    expect(find(items, 'method')?.dropdown?.map((item) => item.label)).toEqual([
      'Methodology',
      'Technology',
      'Team',
    ]);
  });
});
