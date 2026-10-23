// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  buildClientCaseSection,
  buildExpertCards,
  buildOtherChallengeLinks,
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
  contribution: { fr: 'Elle structure', en: 'She structures' },
  previousCompanies: ['Salesforce', '[Company]'],
  tools: [
    { slug: 'hubspot', name: 'HubSpot' },
    { slug: 'clari', name: 'Clari' },
  ],
  ...overrides,
});

describe('buildClientCaseSection', () => {
  it('returns null when the Story reference is broken', () => {
    expect(buildClientCaseSection(null)).toBeNull();
  });

  it('keeps written values and links the Story', () => {
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

  it('falls back on the Story title and subtitle for placeholders', () => {
    const section = buildClientCaseSection(
      clientCase({
        headline: '[Client name]: [the change in one sentence].',
        summary: '[Summary]',
      }),
    );
    expect(section?.headline).toBe(story.title);
    expect(section?.summary).toBe(story.subtitle);
  });

  it('drops a metric whose value or label is a placeholder', () => {
    const section = buildClientCaseSection(
      clientCase({
        metrics: [
          { value: '[X]', label: 'win rate' },
          { value: '5%', label: 'forecast error' },
        ],
      }),
    );
    expect(section?.metrics).toEqual([
      { value: '5%', label: 'forecast error' },
    ]);
  });

  it('hides the section when no headline is written and no Story is named', () => {
    expect(
      buildClientCaseSection(
        clientCase({ headline: '[Headline]', story: null }),
      ),
    ).toBeNull();
  });

  it('shows no link when the challenge names no Story', () => {
    const section = buildClientCaseSection(clientCase({ story: null }));
    expect(section?.storySlug).toBeNull();
    expect(section?.summary).toBe('Six months to rebuild the pipeline review.');
  });

  it('hides a case with neither a Story nor a written metric', () => {
    // revenue-ai: a written headline over placeholder metrics, no Story.
    expect(
      buildClientCaseSection(
        clientCase({ story: null, metrics: [{ value: '[X]', label: '[Y]' }] }),
      ),
    ).toBeNull();
  });
});

describe('buildExpertCards', () => {
  it('keeps the page language and tool names', () => {
    expect(buildExpertCards([expert()], 'en')).toEqual([
      {
        slug: 'jane',
        name: 'Jane Doe',
        role: 'RevOps consultant',
        photo: 'https://blob/jane.jpg',
        contribution: 'She structures',
        tools: ['HubSpot', 'Clari'],
        previousCompanies: ['Salesforce'],
      },
    ]);
    expect(buildExpertCards([expert()], 'fr')[0]).toMatchObject({
      role: 'Consultante RevOps',
      contribution: 'Elle structure',
    });
  });

  it('drops a placeholder contribution and missing companies', () => {
    const [card] = buildExpertCards(
      [
        expert({
          contribution: { fr: '[Apport]', en: '[Contribution]' },
          previousCompanies: undefined,
        }),
      ],
      'en',
    );
    expect(card.contribution).toBeNull();
    expect(card.previousCompanies).toEqual([]);
  });
});

describe('buildOtherChallengeLinks', () => {
  it('drops a placeholder tagline', () => {
    expect(
      buildOtherChallengeLinks([
        {
          slug: 'revenue-ai',
          key: 'ai',
          order: 6,
          name: 'Revenue AI',
          tagline: '[Tagline]',
        },
      ]),
    ).toEqual([
      { slug: 'revenue-ai', key: 'ai', name: 'Revenue AI', tagline: null },
    ]);
  });
});
