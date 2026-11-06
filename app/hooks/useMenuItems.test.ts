import { describe, expect, it } from 'vitest';

import type { NavItem } from '~/components/navbar/types';

import { placeChallengeItem } from './useMenuItems';

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
