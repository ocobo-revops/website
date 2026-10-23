/**
 * Cross-references of a challenge page (#232, #235): the client case Story,
 * the method tools, the partner Tool and the experts.
 *
 * The posts repo checks the same references when files are written
 * (ocobo-revops/posts#98). This is the second line of defence: a broken
 * reference hides only the block that depends on it and logs a validation
 * error. The page never fails. In a tool list, a broken Tool slug drops only
 * that tool.
 *
 * The client case, the partner and the experts come out cleaned of mockup
 * placeholders (`placeholder.ts`), each drop logged as a warning. The other
 * challenges are the navbar list of the `_main` layout
 * (`challenge-menu.server.ts`).
 */

import type { MarkdocFile } from '~/types';
import { isChallengeSlug } from '../challenge-page';
import type { ChallengeFrontmatter } from '../challenge-schema';
import type { StoryFrontmatter } from '../schemas';
import { fetchStory } from './api';
import {
  type Member,
  type MemberRegistry,
  getChallengeExperts,
  loadMemberRegistry,
} from './members';
import {
  type ReportDrop,
  dropReporter,
  hasPlaceholder,
  writtenOrNull,
} from './placeholder';
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

type CaseMetric = ChallengeFrontmatter['case']['metrics'][number];

/** A client case with written texts only. */
export type ChallengeClientCase = {
  /** The case headline, or the Story title when it is a placeholder. */
  headline: string;
  /** The case summary, or the Story subtitle when it is a placeholder. */
  summary: string | null;
  /** The metrics whose value and label are both written. */
  metrics: CaseMetric[];
  /** `null` when the challenge names no Story. */
  story: CaseStory | null;
};

type PartnerMetric = NonNullable<
  ChallengeFrontmatter['partner']
>['metrics'][number];

/** A partner block with written texts only. */
export type ChallengePartner = {
  tool: Tool;
  sentence: string;
  /** The metrics whose three texts are written. */
  metrics: PartnerMetric[];
  source: string;
};

/**
 * A Team member whose `challenge` matches, with resolved tools and without
 * placeholder contribution or companies.
 */
export type ChallengeExpert = Omit<
  Member,
  'tools' | 'contribution' | 'previousCompanies'
> & {
  tools: Tool[];
  contribution: { fr: string | null; en: string | null };
  previousCompanies: string[];
};

/** A block is `null` when it is absent or one of its references is broken. */
export type ChallengeReferences = {
  clientCase: ChallengeClientCase | null;
  methodTools: Tool[];
  partner: ChallengePartner | null;
  experts: ChallengeExpert[];
};

export type ChallengeReferenceSources = {
  slug: string;
  challenge: ChallengeFrontmatter;
  /** `null` when the Story fetch failed or the challenge names no Story. */
  story: MarkdocFile<StoryFrontmatter> | null;
  tools: ToolRegistry;
  members: MemberRegistry;
};

const emptyReferences = (): ChallengeReferences => ({
  clientCase: null,
  methodTools: [],
  partner: null,
  experts: [],
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

function resolveCaseStory({
  slug,
  challenge,
  story,
}: ChallengeReferenceSources): CaseStory | null | 'broken' {
  const storySlug = challenge.case.story;
  if (storySlug === undefined) return null;
  if (!story) {
    logBrokenReference(slug, `case.story "${storySlug}" did not resolve`);
    return 'broken';
  }
  const { name, title, subtitle } = story.frontmatter;
  return { slug: story.slug, name, title, subtitle };
}

/**
 * `null` hides the block: the Story did not resolve, neither the case nor
 * its Story gives a headline, or the case has neither a Story nor a written
 * metric (a headline alone names no client).
 */
function resolveClientCase(
  sources: ChallengeReferenceSources,
  reportDrop: ReportDrop,
): ChallengeClientCase | null {
  const story = resolveCaseStory(sources);
  if (story === 'broken') return null;
  const { headline, summary, metrics } = sources.challenge.case;
  const written = (value: string, field: string) =>
    writtenOrNull(value, () => reportDrop(field));

  const metricsWritten = metrics.filter((metric, index) => {
    const kept = !hasPlaceholder(metric.value) && !hasPlaceholder(metric.label);
    if (!kept) reportDrop(`case.metrics[${index}]`);
    return kept;
  });
  const caseHeadline = written(headline, 'case.headline') ?? story?.title;
  if (!caseHeadline) {
    reportDrop('case', 'no headline');
    return null;
  }
  if (!story && metricsWritten.length === 0) {
    reportDrop('case', 'no Story and no metric');
    return null;
  }
  return {
    headline: caseHeadline,
    summary: written(summary, 'case.summary') ?? story?.subtitle ?? null,
    metrics: metricsWritten,
    story,
  };
}

/**
 * `null` hides the block: the Tool did not resolve, or the sentence or the
 * source is a placeholder. The figures belong to the partner, so they never
 * show without their source.
 */
function resolvePartner(
  { challenge, tools }: ChallengeReferenceSources,
  reportTool: (message: string) => void,
  reportDrop: ReportDrop,
): ChallengePartner | null {
  if (!challenge.partner) return null;
  const tool = resolveTool(challenge.partner.tool, tools);
  if (!tool) {
    reportTool(`partner.tool "${challenge.partner.tool}" is not a Tool`);
    return null;
  }
  const written = (field: 'sentence' | 'source') =>
    writtenOrNull(challenge.partner?.[field], () =>
      reportDrop(`partner.${field}`),
    );
  const sentence = written('sentence');
  const source = written('source');
  if (!sentence || !source) return null;
  const metrics = challenge.partner.metrics.filter((metric, index) => {
    const { before, after, label } = metric;
    const kept = ![before, after, label].some(hasPlaceholder);
    if (!kept) reportDrop(`partner.metrics[${index}]`);
    return kept;
  });
  return { tool, sentence, metrics, source };
}

function resolveExperts(
  { challenge, tools, members }: ChallengeReferenceSources,
  reportTool: (message: string) => void,
  reportDrop: ReportDrop,
): ChallengeExpert[] {
  return getChallengeExperts(members, challenge.key).map((member) => {
    const field = (name: string) => `team/${member.slug} ${name}`;
    const contribution = (lang: 'fr' | 'en') =>
      writtenOrNull(member.contribution?.[lang], () =>
        reportDrop(field(`contribution.${lang}`)),
      );
    return {
      ...member,
      tools: resolveTools(member.tools ?? [], tools, (toolSlug) =>
        reportTool(`team/${member.slug} tools "${toolSlug}" is not a Tool`),
      ),
      contribution: { fr: contribution('fr'), en: contribution('en') },
      previousCompanies: (member.previousCompanies ?? []).filter(
        (company, index) => {
          if (!hasPlaceholder(company)) return true;
          reportDrop(field(`previousCompanies[${index}]`));
          return false;
        },
      ),
    };
  });
}

export function resolveChallengeReferences(
  sources: ChallengeReferenceSources,
): ChallengeReferences {
  const { slug, challenge, tools } = sources;
  const reportTool = toolReporter(slug, tools);
  const reportDrop = dropReporter('ChallengeReferences', slug);
  return {
    clientCase: resolveClientCase(sources, reportDrop),
    methodTools: resolveTools(challenge.method.tools, tools, (toolSlug) =>
      reportTool(`method.tools "${toolSlug}" is not a Tool`),
    ),
    partner: resolvePartner(sources, reportTool, reportDrop),
    experts: resolveExperts(sources, reportTool, reportDrop),
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
    const [story, tools, members] = await Promise.all([
      loadCaseStory(challenge.case.story, lang),
      loadToolRegistry(),
      loadMemberRegistry(),
    ]);
    return resolveChallengeReferences({
      slug,
      challenge,
      story,
      tools,
      members,
    });
  } catch (error) {
    logBrokenReference(slug, `references failed to load: ${String(error)}`);
    return emptyReferences();
  }
}
