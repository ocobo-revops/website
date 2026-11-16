/**
 * Loader tests for the studio route (#244).
 *
 * Behaviours verified:
 *  1. Every active member gets a card, with or without expert fields.
 *  2. Expert fields resolve in the page language: tool names through the Tool
 *     registry, all tools kept, placeholders dropped.
 *  3. Previous companies are collected once each, in member order.
 *  4. The i18n, member and tool loads fire in parallel.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Member, MemberRegistry } from '~/modules/content/members';
import type { ToolRegistry } from '~/modules/content/tools';
import { invokeLoader } from '~/test/loader-harness';

const getFixedTMock = vi.fn();
const loadMemberRegistryMock = vi.fn();
const loadToolRegistryMock = vi.fn();
const isPageEnabledMock = vi.fn();

vi.mock('~/localization/i18n.server', () => ({
  default: {
    getFixedT: (...args: unknown[]) => getFixedTMock(...args),
  },
}));

vi.mock('~/modules/content/members', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/modules/content/members')>()),
  loadMemberRegistry: () => loadMemberRegistryMock(),
}));

vi.mock('~/modules/content/tools', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/modules/content/tools')>()),
  loadToolRegistry: () => loadToolRegistryMock(),
}));

vi.mock('~/modules/feature-flags', () => ({
  throwIfDisabled: vi.fn(),
  isPageEnabled: (...args: unknown[]) => isPageEnabledMock(...args),
}));

vi.mock('~/utils/redirections', () => ({
  redirectWithLocale: vi.fn().mockResolvedValue(undefined),
}));

/** Keeps expected logs out of the test output. */
const silence = () => undefined;

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

function member(slug: string, fields: Partial<Member> = {}): Member {
  return {
    slug,
    name: `${slug} Doe`,
    role: { fr: `Rôle ${slug}`, en: `Role ${slug}` },
    track: 'architect',
    avatar: `https://example.com/${slug}.jpg`,
    displayOrder: 1,
    active: true,
    bio: { fr: `Bio ${slug}`, en: `Bio ${slug} en` },
    featuredOnAboutUs: false,
    ...fields,
  };
}

const tools: ToolRegistry = {
  hubspot: { slug: 'hubspot', name: 'HubSpot' },
  attio: { slug: 'attio', name: 'Attio' },
  n8n: { slug: 'n8n', name: 'n8n' },
  clay: { slug: 'clay', name: 'Clay' },
  dust: { slug: 'dust', name: 'Dust' },
};

const registry: MemberRegistry = {
  alice: member('alice', {
    displayOrder: 1,
    challenge: 'cx',
    contribution: { fr: 'Elle structure le support.', en: 'She runs support.' },
    // Five tools: the loader keeps them all; `team-section.test.tsx` checks
    // that the card shows them all.
    tools: ['hubspot', 'attio', 'n8n', 'clay', 'dust'],
    previousCompanies: ['Qonto', '[Entreprise]', 'Alan'],
  }),
  // No expert fields at all.
  bob: member('bob', { displayOrder: 2 }),
  carol: member('carol', {
    displayOrder: 3,
    challenge: 'sy',
    contribution: { fr: '[Contribution]', en: '[Contribution]' },
    tools: ['hubspot'],
    previousCompanies: ['qonto', 'Payfit'],
  }),
  dan: member('dan', { displayOrder: 4, active: false }),
};

async function runLoader(url = 'http://test.local/studio', params = {}) {
  const { loader } = await import('./_main.($lang).studio');
  const outcome = await invokeLoader(loader, { url, params });
  expect(outcome.type).toBe('data');
  if (outcome.type !== 'data') throw new Error('expected data');
  return outcome.data;
}

describe('studio loader', () => {
  it('gives every active member a card, with or without expert fields', async () => {
    getFixedTMock.mockResolvedValue((key: string) => `fr:${key}`);
    loadMemberRegistryMock.mockResolvedValue(registry);
    loadToolRegistryMock.mockResolvedValue(tools);
    isPageEnabledMock.mockReturnValue(true);
    vi.spyOn(console, 'warn').mockImplementation(silence);
    vi.spyOn(console, 'error').mockImplementation(silence);

    const data = await runLoader();

    expect(data.title).toBe('fr:meta.title');
    expect(data.description).toBe('fr:meta.description');
    expect(data.lang).toBe('fr');
    expect(data.jobsEnabled).toBe(true);
    expect(isPageEnabledMock).toHaveBeenCalledWith('jobs');
    expect(data.members.map((card) => card.slug)).toEqual([
      'alice',
      'bob',
      'carol',
    ]);

    const [alice, bob, carol] = data.members;
    expect(alice).toEqual({
      slug: 'alice',
      name: 'alice Doe',
      role: 'Rôle alice',
      photo: 'https://example.com/alice.jpg',
      challenge: 'cx',
      contribution: 'Elle structure le support.',
      tools: ['HubSpot', 'Attio', 'n8n', 'Clay', 'Dust'],
      previousCompanies: ['Qonto', 'Alan'],
      bio: 'Bio alice',
    });
    expect(bob).toEqual({
      slug: 'bob',
      name: 'bob Doe',
      role: 'Rôle bob',
      photo: 'https://example.com/bob.jpg',
      challenge: null,
      contribution: null,
      tools: [],
      previousCompanies: [],
      // The bio fills the back of a card with no contribution.
      bio: 'Bio bob',
    });
    // A placeholder contribution drops; the card stays.
    expect(carol.contribution).toBeNull();
    expect(carol.tools).toEqual(['HubSpot']);

    expect(data.previousCompanies).toEqual(['Qonto', 'Alan', 'Payfit']);
  });

  it('resolves the cards in English on /en', async () => {
    getFixedTMock.mockResolvedValue((key: string) => `en:${key}`);
    loadMemberRegistryMock.mockResolvedValue(registry);
    loadToolRegistryMock.mockResolvedValue(tools);
    isPageEnabledMock.mockReturnValue(false);
    vi.spyOn(console, 'warn').mockImplementation(silence);
    vi.spyOn(console, 'error').mockImplementation(silence);

    const data = await runLoader('http://test.local/en/studio', {
      lang: 'en',
    });

    expect(getFixedTMock).toHaveBeenCalledWith('en', 'studio');
    expect(data.lang).toBe('en');
    expect(data.jobsEnabled).toBe(false);
    expect(data.members[0].role).toBe('Role alice');
    expect(data.members[0].contribution).toBe('She runs support.');
    expect(data.members[0].bio).toBe('Bio alice en');
  });

  it('drops an unknown tool and keeps the card', async () => {
    getFixedTMock.mockResolvedValue((key: string) => key);
    loadMemberRegistryMock.mockResolvedValue({
      erin: member('erin', {
        challenge: 'rp',
        contribution: { fr: 'Contribution', en: 'Contribution' },
        tools: ['hubspot', 'unknown-tool'],
      }),
    });
    loadToolRegistryMock.mockResolvedValue(tools);
    isPageEnabledMock.mockReturnValue(true);
    const error = vi.spyOn(console, 'error').mockImplementation(silence);

    const data = await runLoader();

    expect(data.members).toHaveLength(1);
    expect(data.members[0].tools).toEqual(['HubSpot']);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('unknown-tool'));
  });

  it('fires getFixedT, loadMemberRegistry and loadToolRegistry in parallel', async () => {
    let resolveT!: (fn: (key: string) => string) => void;
    let resolveRegistry!: (registry: MemberRegistry) => void;
    let resolveTools!: (tools: ToolRegistry) => void;
    getFixedTMock.mockReturnValue(
      new Promise((r) => {
        resolveT = r;
      }),
    );
    loadMemberRegistryMock.mockReturnValue(
      new Promise((r) => {
        resolveRegistry = r;
      }),
    );
    loadToolRegistryMock.mockReturnValue(
      new Promise((r) => {
        resolveTools = r;
      }),
    );
    isPageEnabledMock.mockReturnValue(true);

    const { loader } = await import('./_main.($lang).studio');
    const loaderPromise = invokeLoader(loader, {
      url: 'http://test.local/studio',
      params: {},
    });

    // Let the loader run past its first await point.
    await new Promise((r) => setImmediate(r));

    // All three start before any resolves: sequential awaits would call the
    // later loads only once the earlier ones settle.
    expect(getFixedTMock).toHaveBeenCalledTimes(1);
    expect(loadMemberRegistryMock).toHaveBeenCalledTimes(1);
    expect(loadToolRegistryMock).toHaveBeenCalledTimes(1);

    resolveT((key: string) => key);
    resolveRegistry({});
    resolveTools({});
    await loaderPromise;
  });
});
