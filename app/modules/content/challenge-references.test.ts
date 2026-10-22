// @vitest-environment node

/**
 * Challenge cross-references (#232). The challenge files come from the
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
    challenges: frenchChallenges,
  });
}

beforeAll(async () => {
  const [status, , files] = await fetchChallenges('fr');
  if (status !== 200 || !files) throw new Error('French fixtures failed');
  frenchChallenges = files;
});

let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(console, 'info').mockImplementation(() => undefined);
});

afterEach(() => {
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
    const { case: base } = challengeFile('revenue-performance').frontmatter;

    const { clientCase } = resolve('revenue-performance', {
      challenge: { case: { ...base, story: 'acme' } },
      story: story('acme'),
    });

    expect(clientCase?.headline).toBe(base.headline);
    expect(clientCase?.story).toEqual({
      slug: 'acme',
      name: 'Acme',
      title: 'Acme forecasts its quarter',
      subtitle: 'A number you can see coming',
    });
  });

  it('shows without a Story when the challenge names none', () => {
    const { clientCase } = resolve('revenue-performance');

    expect(clientCase?.story).toBeNull();
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('case.story'),
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

  it('is absent without logging when the challenge has none', () => {
    const { partner } = resolve('revenue-performance');

    expect(partner).toBeNull();
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('partner.tool'),
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

describe('other challenges', () => {
  it('exclude the current challenge, in display order', () => {
    const { otherChallenges } = resolve('revenue-performance');

    expect(otherChallenges.map(({ slug }) => slug)).toEqual([
      'sales-experience',
      'customer-experience',
      'sales-compensation',
      'revenue-systems',
      'revenue-ai',
    ]);
  });

  it('exclude the challenges of other languages', async () => {
    const { frontmatter } = challengeFile('revenue-performance');

    const french = await loadChallengeReferences(
      'revenue-performance',
      frontmatter,
      'fr',
    );
    // The English fixtures hold only revenue-performance.
    const english = await loadChallengeReferences(
      'revenue-performance',
      frontmatter,
      'en',
    );

    expect(french.otherChallenges).toHaveLength(5);
    expect(english.otherChallenges).toEqual([]);
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
    expect(references.otherChallenges).toHaveLength(5);
  });
});
