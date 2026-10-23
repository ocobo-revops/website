// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  buildChallengeReferenceSections,
  buildClientCaseSection,
  buildExpertCards,
} from './challenge-reference-sections';
import type {
  ChallengeClientCase,
  ChallengeExpert,
} from './content/challenge-references';

const story = {
  slug: 'acme',
  name: 'Acme',
  title: 'Acme closes its quarters on time',
  subtitle: 'A forecast the board trusts',
};

const clientCase = (
  overrides: Partial<ChallengeClientCase> = {},
): ChallengeClientCase => ({
  headline: 'Acme: a forecast within 5%.',
  summary: 'Six months to rebuild the pipeline review.',
  metrics: [
    { value: '+32%', label: 'win rate' },
    { value: '5%', label: 'forecast error' },
  ],
  story,
  ...overrides,
});

const expert = (overrides: Partial<ChallengeExpert> = {}): ChallengeExpert => ({
  slug: 'jane',
  name: 'Jane Doe',
  role: { fr: 'Consultante RevOps', en: 'RevOps consultant' },
  track: 'builder',
  avatar: 'https://blob/jane.jpg',
  displayOrder: 1,
  active: true,
  bio: { fr: 'bio', en: 'bio' },
  featuredOnAboutUs: false,
  challenge: 'rp',
  contribution: { fr: 'Elle structure', en: null },
  previousCompanies: ['Salesforce'],
  tools: [
    { slug: 'hubspot', name: 'HubSpot' },
    { slug: 'clari', name: 'Clari' },
  ],
  ...overrides,
});

describe('buildClientCaseSection', () => {
  it('returns null when the resolver hid the case', () => {
    expect(buildClientCaseSection(null)).toBeNull();
  });

  it('keeps the texts and the Story slug only', () => {
    expect(buildClientCaseSection(clientCase())).toEqual({
      headline: 'Acme: a forecast within 5%.',
      summary: 'Six months to rebuild the pipeline review.',
      metrics: [
        { value: '+32%', label: 'win rate' },
        { value: '5%', label: 'forecast error' },
      ],
      storySlug: 'acme',
    });
  });

  it('shows no link when the challenge names no Story', () => {
    expect(
      buildClientCaseSection(clientCase({ story: null }))?.storySlug,
    ).toBeNull();
  });
});

describe('buildExpertCards', () => {
  it('keeps the page language and tool names', () => {
    expect(buildExpertCards([expert()], 'fr')).toEqual([
      {
        slug: 'jane',
        name: 'Jane Doe',
        role: 'Consultante RevOps',
        photo: 'https://blob/jane.jpg',
        contribution: 'Elle structure',
        tools: ['HubSpot', 'Clari'],
        previousCompanies: ['Salesforce'],
      },
    ]);
    expect(buildExpertCards([expert()], 'en')[0]).toMatchObject({
      role: 'RevOps consultant',
      contribution: null,
    });
  });
});

describe('buildChallengeReferenceSections', () => {
  it('passes the method tools and the partner through', () => {
    const sections = buildChallengeReferenceSections(
      {
        clientCase: null,
        methodTools: [{ slug: 'hubspot', name: 'HubSpot' }],
        partner: null,
        experts: [expert()],
      },
      'en',
    );

    expect(sections.methodTools).toEqual([
      { slug: 'hubspot', name: 'HubSpot' },
    ]);
    expect(sections.partner).toBeNull();
    expect(sections.clientCase).toBeNull();
    expect(sections.experts.map(({ slug }) => slug)).toEqual(['jane']);
  });
});
