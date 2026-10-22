/**
 * Cross-references of a challenge page (#232): the client case Story, the
 * method tools, the partner Tool, the experts and the other challenges.
 *
 * The posts repo checks the same references when files are written
 * (ocobo-revops/posts#98). This is the second line of defence: a broken
 * reference hides only the block that depends on it and logs a validation
 * error. The page never fails. In a tool list, a broken Tool slug drops only
 * that tool.
 */

import type { MarkdocFile } from '~/types';
import { isChallengeSlug } from '../challenge-page';
import type { ChallengeFrontmatter, ChallengeKey } from '../challenge-schema';
import type { StoryFrontmatter } from '../schemas';
import { fetchChallenges, fetchStory } from './api';
import {
  type Member,
  type MemberRegistry,
  getChallengeExperts,
  loadMemberRegistry,
} from './members';
import {
  type Tool,
  type ToolRegistry,
  loadToolRegistry,
  resolveTool,
} from './tools';

/** The Story a client case links to. */
export type CaseStory = {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
};

export type ChallengeClientCase = Omit<
  ChallengeFrontmatter['case'],
  'story'
> & {
  /** `null` when the challenge names no Story. */
  story: CaseStory | null;
};

export type ChallengePartner = Omit<
  NonNullable<ChallengeFrontmatter['partner']>,
  'tool'
> & {
  tool: Tool;
};

/** A Team member whose `challenge` matches, with resolved tools. */
export type ChallengeExpert = Omit<Member, 'tools'> & { tools: Tool[] };

export type OtherChallenge = {
  slug: string;
  key: ChallengeKey;
  order: number;
  name: string;
  tagline: string;
};

/** A block is `null` when it is absent or one of its references is broken. */
export type ChallengeReferences = {
  clientCase: ChallengeClientCase | null;
  methodTools: Tool[];
  partner: ChallengePartner | null;
  experts: ChallengeExpert[];
  otherChallenges: OtherChallenge[];
};

export type ChallengeReferenceSources = {
  slug: string;
  challenge: ChallengeFrontmatter;
  /** `null` when the Story fetch failed or the challenge names no Story. */
  story: MarkdocFile<StoryFrontmatter> | null;
  tools: ToolRegistry;
  members: MemberRegistry;
  /** Every challenge of the page language, the current one included. */
  challenges: MarkdocFile<ChallengeFrontmatter>[];
};

const emptyReferences = (): ChallengeReferences => ({
  clientCase: null,
  methodTools: [],
  partner: null,
  experts: [],
  otherChallenges: [],
});

function logBrokenReference(slug: string, message: string): void {
  console.error(`[ChallengeReferences] ${slug}: ${message}`);
}

/**
 * Logs a broken Tool slug. An empty registry means the Tool files failed to
 * load (`loadToolRegistry` already logged why): every tool then drops
 * without one log per slug, which would blame the challenge file.
 */
function toolReporter(slug: string, tools: ToolRegistry) {
  const registryLoaded = Object.keys(tools).length > 0;
  return (message: string) => {
    if (registryLoaded) logBrokenReference(slug, message);
  };
}

function resolveTools(
  slugs: readonly string[],
  registry: ToolRegistry,
  onBroken: (toolSlug: string) => void,
): Tool[] {
  return slugs.flatMap((toolSlug) => {
    const tool = resolveTool(toolSlug, registry);
    if (!tool) {
      onBroken(toolSlug);
      return [];
    }
    return [tool];
  });
}

function resolveClientCase({
  slug,
  challenge,
  story,
}: ChallengeReferenceSources): ChallengeClientCase | null {
  const { story: storySlug, ...rest } = challenge.case;
  if (storySlug === undefined) return { ...rest, story: null };
  if (!story) {
    logBrokenReference(slug, `case.story "${storySlug}" did not resolve`);
    return null;
  }
  const { name, title, subtitle } = story.frontmatter;
  return { ...rest, story: { slug: story.slug, name, title, subtitle } };
}

function resolvePartner(
  { challenge, tools }: ChallengeReferenceSources,
  reportTool: (message: string) => void,
): ChallengePartner | null {
  if (!challenge.partner) return null;
  const tool = resolveTool(challenge.partner.tool, tools);
  if (!tool) {
    reportTool(`partner.tool "${challenge.partner.tool}" is not a Tool`);
    return null;
  }
  return { ...challenge.partner, tool };
}

function resolveExperts(
  { challenge, tools, members }: ChallengeReferenceSources,
  reportTool: (message: string) => void,
): ChallengeExpert[] {
  return getChallengeExperts(members, challenge.key).map((member) => ({
    ...member,
    tools: resolveTools(member.tools ?? [], tools, (toolSlug) =>
      reportTool(`team/${member.slug} tools "${toolSlug}" is not a Tool`),
    ),
  }));
}

function listOtherChallenges({
  slug,
  challenges,
}: ChallengeReferenceSources): OtherChallenge[] {
  return challenges
    .filter((file) => file.slug !== slug)
    .map(({ slug: otherSlug, frontmatter }) => ({
      slug: otherSlug,
      key: frontmatter.key,
      order: frontmatter.order,
      name: frontmatter.name,
      tagline: frontmatter.tagline,
    }))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export function resolveChallengeReferences(
  sources: ChallengeReferenceSources,
): ChallengeReferences {
  const { slug, challenge, tools } = sources;
  const reportTool = toolReporter(slug, tools);
  return {
    clientCase: resolveClientCase(sources),
    methodTools: resolveTools(challenge.method.tools, tools, (toolSlug) =>
      reportTool(`method.tools "${toolSlug}" is not a Tool`),
    ),
    partner: resolvePartner(sources, reportTool),
    experts: resolveExperts(sources, reportTool),
    otherChallenges: listOtherChallenges(sources),
  };
}

async function loadCaseStory(
  storySlug: string | undefined,
  lang: string,
): Promise<MarkdocFile<StoryFrontmatter> | null> {
  // The slug becomes a file path in the content source: kebab-case only.
  if (storySlug === undefined || !isChallengeSlug(storySlug)) return null;
  const [status, , story] = await fetchStory(storySlug, lang);
  return status === 200 && story ? story : null;
}

async function loadLanguageChallenges(
  slug: string,
  lang: string,
): Promise<MarkdocFile<ChallengeFrontmatter>[]> {
  const [status, state, challenges] = await fetchChallenges(lang);
  if (status !== 200 || !challenges) {
    logBrokenReference(slug, `other challenges failed to load: ${state}`);
    return [];
  }
  return challenges;
}

/**
 * Fetches what the references point to and resolves them. Never throws: an
 * unexpected failure hides every block that needs a reference.
 *
 * The Tool and Team member registries return `{}` when any of their files
 * fails, and a list fetch fails on its first invalid file. One invalid Tool
 * file therefore hides every tool, one invalid Team file every expert.
 */
export async function loadChallengeReferences(
  slug: string,
  challenge: ChallengeFrontmatter,
  lang: string,
): Promise<ChallengeReferences> {
  try {
    const [story, tools, members, challenges] = await Promise.all([
      loadCaseStory(challenge.case.story, lang),
      loadToolRegistry(),
      loadMemberRegistry(),
      loadLanguageChallenges(slug, lang),
    ]);
    return resolveChallengeReferences({
      slug,
      challenge,
      story,
      tools,
      members,
      challenges,
    });
  } catch (error) {
    logBrokenReference(slug, `references failed to load: ${String(error)}`);
    return emptyReferences();
  }
}
