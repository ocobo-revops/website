// @vitest-environment node

/**
 * Challenge cross-references (#232, #235). The challenge files come from the
 * website test fixtures through the filesystem source. Stories, Tools and
 * expert Team members are built here: the fixtures have no `stories/` or
 * `tools/` folder, and no fixture Team member sets an expert field.
 */

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import type { MarkdocFile } from '~/types';
import type { ChallengeFrontmatter } from '../challenge-schema';
import type { StoryFrontmatter } from '../schemas';
import type { Member, MemberRegistry } from './members';
import type { Tool, ToolRegistry } from './tools';

const failures = vi.hoisted(() => ({ toolRegistry: false }));

vi.mock('./tools', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./tools')>();
  return {
    ...actual,
    loadToolRegistry: async () => {
      if (failures.toolRegistry) throw new Error('registry exploded');
      return actual.loadToolRegistry();
    },
  };
});

vi.mock('../env.server', () => ({
  getPrivateEnvVars: () => ({
    readContentFrom: 'locale',
    localeRepoAPIUrl: `${__dirname}/../../test/fixtures/content`,
    githubRepoAPIUrl: '',
    githubAccessToken: '',
    githubBranch: 'main',
  }),
}));

const { fetchChallenges } = await import('./api');
const { loadChallengeReferences, resolveChallengeReferences } = await import(
  './challenge-references'
);

type ChallengeFile = MarkdocFile<ChallengeFrontmatter>;

let frenchChallenges: ChallengeFile[] = [];

function challengeFile(slug: string): ChallengeFile {
  const file = frenchChallenges.find((challenge) => challenge.slug === slug);
  if (!file) throw new Error(`Missing challenge fixture ${slug}`);
  return file;
}

const tool = (slug: string): Tool => ({
  slug,
  name: slug.toUpperCase(),
  iconUrl: `https://blob/${slug}.svg`,
});

const toolRegistry = (...slugs: string[]): ToolRegistry =>
  Object.fromEntries(slugs.map((slug) => [slug, tool(slug)]));

const member = (overrides: Partial<Member> & { slug: string }): Member => ({
  name: overrides.slug,
  role: { fr: 'Consultant', en: 'Consultant' },
  track: 'builder',
  avatar: `https://blob/${overrides.slug}.jpg`,
  displayOrder: 1,
  active: true,
  bio: { fr: 'bio', en: 'bio' },
  featuredOnAboutUs: false,
  ...overrides,
});

const memberRegistry = (...members: Member[]): MemberRegistry =>
  Object.fromEntries(members.map((m) => [m.slug, m]));

const story = (slug: string): MarkdocFile<StoryFrontmatter> => ({
  slug,
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
});

const writtenCase: ChallengeFrontmatter['case'] = {
  headline: 'Acme: a forecast within 5%.',
  summary: 'Six months to rebuild the pipeline review.',
  metrics: [
    { value: '+32%', label: 'Win rate' },
    { value: '5%', label: 'Forecast error' },
  ],
};

/** Resolves `slug` against every French fixture, with no Story, Tool or member. */
function resolve(
  slug: string,
  overrides: {
    challenge?: Partial<ChallengeFrontmatter>;
    story?: MarkdocFile<StoryFrontmatter> | null;
    tools?: ToolRegistry;
    members?: MemberRegistry;
  } = {},
) {
  return resolveChallengeReferences({
    slug,
    challenge: { ...challengeFile(slug).frontmatter, ...overrides.challenge },
    story: overrides.story ?? null,
    tools: overrides.tools ?? {},
    members: overrides.members ?? {},
  });
}

beforeAll(async () => {
  const [status, , files] = await fetchChallenges('fr');
  if (status !== 200 || !files) throw new Error('French fixtures failed');
  frenchChallenges = files;
});

let errorSpy: ReturnType<typeof vi.spyOn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  vi.spyOn(console, 'info').mockImplementation(() => undefined);
});

afterEach(() => {
  failures.toolRegistry = false;
  vi.restoreAllMocks();
});

describe('experts', () => {
  const members = memberRegistry(
    member({
      slug: 'late',
      challenge: 'rp',
      displayOrder: 9,
      tools: ['hubspot'],
    }),
    member({
      slug: 'early',
      challenge: 'rp',
      displayOrder: 2,
      tools: ['hubspot'],
    }),
    member({ slug: 'other-challenge', challenge: 'sc', tools: ['qobra'] }),
    member({ slug: 'no-challenge' }),
    member({
      slug: 'inactive',
      challenge: 'rp',
      active: false,
      tools: ['hubspot'],
    }),
  );

  it('are the active Team members whose challenge matches, in display order', () => {
    const { experts } = resolve('revenue-performance', {
      members,
      tools: toolRegistry('hubspot'),
    });

    expect(experts.map(({ slug }) => slug)).toEqual(['early', 'late']);
  });

  it('break display order ties by slug', () => {
    const { experts } = resolve('revenue-performance', {
      members: memberRegistry(
        member({ slug: 'b', challenge: 'rp', tools: ['hubspot'] }),
        member({ slug: 'a', challenge: 'rp', tools: ['hubspot'] }),
      ),
    });

    expect(experts.map(({ slug }) => slug)).toEqual(['a', 'b']);
  });

  it('carry resolved tools, without the broken Tool slugs', () => {
    const { experts } = resolve('revenue-performance', {
      members: memberRegistry(
        member({ slug: 'expert', challenge: 'rp', tools: ['hubspot', 'gone'] }),
      ),
      tools: toolRegistry('hubspot'),
    });

    expect(experts[0].tools).toEqual([tool('hubspot')]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('team/expert tools "gone"'),
    );
  });

  it('drop a placeholder contribution or company and warn', () => {
    const { experts } = resolve('revenue-performance', {
      members: memberRegistry(
        member({
          slug: 'expert',
          challenge: 'rp',
          contribution: { fr: '[Apport]', en: 'She structures' },
          previousCompanies: ['Salesforce', '[Company]'],
        }),
      ),
    });

    expect(experts[0].contribution).toEqual({
      fr: null,
      en: 'She structures',
    });
    expect(experts[0].previousCompanies).toEqual(['Salesforce']);
    expect(warnSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: team/expert contribution.fr dropped (placeholder)',
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: team/expert previousCompanies[1] dropped (placeholder)',
    );
  });
});

describe('client case', () => {
  it('is hidden and logs a validation error when the Story slug is broken', () => {
    const { case: base } = challengeFile('revenue-performance').frontmatter;

    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: { ...base, story: 'missing-story' } },
      story: null,
    });

    expect(clientCase).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: case.story "missing-story" did not resolve',
    );
  });

  it('links the resolved Story', () => {
    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: { ...writtenCase, story: 'acme' } },
      story: story('acme'),
    });

    expect(clientCase).toMatchObject({
      headline: writtenCase.headline,
      summary: writtenCase.summary,
      metrics: writtenCase.metrics,
    });
    expect(clientCase?.story).toEqual({
      slug: 'acme',
      name: 'Acme',
      title: 'Acme forecasts its quarter',
      subtitle: 'A number you can see coming',
    });
  });

  it('shows without a Story when the challenge names none', () => {
    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: writtenCase },
    });

    expect(clientCase?.story).toBeNull();
    expect(clientCase?.headline).toBe(writtenCase.headline);
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('case.story'),
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('replaces mockup texts with the Story title and subtitle, and warns', () => {
    // The fixture case is the mockup template: brackets mixed with words.
    const { case: base } = challengeFile('revenue-performance').frontmatter;

    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: { ...base, story: 'acme' } },
      story: story('acme'),
    });

    expect(clientCase).toMatchObject({
      headline: 'Acme forecasts its quarter',
      summary: 'A number you can see coming',
      metrics: [],
    });
    for (const field of ['case.headline', 'case.summary', 'case.metrics[0]']) {
      expect(warnSpy).toHaveBeenCalledWith(
        `[ChallengeReferences] revenue-performance: ${field} dropped (placeholder)`,
      );
    }
  });

  it('drops only the metric that holds a placeholder', () => {
    const { clientCase } = resolve('revenue-performance', {
      challenge: {
        case: {
          ...writtenCase,
          metrics: [
            { value: '[X]', label: 'Win rate' },
            writtenCase.metrics[1],
          ],
        },
      },
    });

    expect(clientCase?.metrics).toEqual([writtenCase.metrics[1]]);
  });

  it('is hidden and warns when no headline is written and no Story is named', () => {
    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: { ...writtenCase, headline: '[Headline]' } },
    });

    expect(clientCase).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: case dropped (no headline)',
    );
  });

  it('is hidden and warns with neither a Story nor a written metric', () => {
    // revenue-ai: a written headline over placeholder metrics, no Story.
    const { clientCase } = resolve('revenue-ai');

    expect(clientCase).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-ai: case dropped (no Story and no metric)',
    );
  });
});

describe('partner', () => {
  it('is hidden and logs a validation error when the Tool slug is broken', () => {
    const { partner } = resolve('sales-compensation', {
      tools: toolRegistry('hubspot'),
    });

    expect(partner).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] sales-compensation: partner.tool "qobra" is not a Tool',
    );
  });

  it('carries the resolved Tool', () => {
    const { partner } = resolve('sales-compensation', {
      tools: toolRegistry('qobra'),
    });

    expect(partner?.tool).toEqual(tool('qobra'));
    expect(partner?.metrics).toHaveLength(2);
  });

  const partnerWith = (
    overrides: Partial<NonNullable<ChallengeFrontmatter['partner']>>,
  ) => {
    const { partner } = challengeFile('sales-compensation').frontmatter;
    if (!partner) throw new Error('sales-compensation has a partner');
    return resolve('sales-compensation', {
      challenge: { partner: { ...partner, ...overrides } },
      tools: toolRegistry('qobra'),
    }).partner;
  };

  it.each(['sentence', 'source'] as const)(
    'is hidden and warns when its %s is a placeholder',
    (field) => {
      expect(partnerWith({ [field]: '[À écrire]' })).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        `[ChallengeReferences] sales-compensation: partner.${field} dropped (placeholder)`,
      );
    },
  );

  it('drops a placeholder metric and warns', () => {
    const partner = partnerWith({
      metrics: [
        { before: '[X] jours', after: '1', label: 'Clôture' },
        { before: '3 jours', after: '½', label: 'Clôture' },
      ],
    });

    expect(partner?.metrics).toEqual([
      { before: '3 jours', after: '½', label: 'Clôture' },
    ]);
    expect(warnSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] sales-compensation: partner.metrics[0] dropped (placeholder)',
    );
  });

  it('is absent without logging when the challenge has none', () => {
    const { partner } = resolve('revenue-performance');

    expect(partner).toBeNull();
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('partner.tool'),
    );
  });
});

describe('tool references with an empty Tool registry', () => {
  it('hide every tool without one log per slug', () => {
    // `loadToolRegistry` returns {} and logs once when a Tool file fails.
    const { methodTools, partner } = resolve('sales-compensation');

    expect(methodTools).toEqual([]);
    expect(partner).toBeNull();
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('is not a Tool'),
    );
  });
});

describe('method tools', () => {
  it('drop only the broken Tool slug and log it', () => {
    // revenue-performance lists hubspot, salesforce, modjo, notion.
    const { methodTools } = resolve('revenue-performance', {
      tools: toolRegistry('hubspot', 'modjo', 'notion'),
    });

    expect(methodTools.map(({ slug }) => slug)).toEqual([
      'hubspot',
      'modjo',
      'notion',
    ]);
    expect(errorSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: method.tools "salesforce" is not a Tool',
    );
  });
});

describe('loadChallengeReferences', () => {
  it('never fails when the referenced folders are missing', async () => {
    // The fixtures have no `tools/` or `stories/` folder.
    const { frontmatter } = challengeFile('sales-compensation');

    const references = await loadChallengeReferences(
      'sales-compensation',
      { ...frontmatter, case: { ...frontmatter.case, story: 'missing-story' } },
      'fr',
    );

    expect(references.clientCase).toBeNull();
    expect(references.partner).toBeNull();
    expect(references.methodTools).toEqual([]);
    expect(references.experts).toEqual([]);
  });

  it('logs the client case when its Story fails to load', async () => {
    const { frontmatter } = challengeFile('revenue-performance');

    await loadChallengeReferences(
      'revenue-performance',
      { ...frontmatter, case: { ...frontmatter.case, story: 'missing-story' } },
      'fr',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      '[ChallengeReferences] revenue-performance: case.story "missing-story" did not resolve',
    );
  });

  it('hides every block when a source throws', async () => {
    failures.toolRegistry = true;
    const { frontmatter } = challengeFile('revenue-performance');

    const references = await loadChallengeReferences(
      'revenue-performance',
      frontmatter,
      'fr',
    );

    expect(references).toEqual({
      clientCase: null,
      methodTools: [],
      partner: null,
      experts: [],
    });
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('references failed to load'),
    );
  });
});
