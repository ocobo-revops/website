/**
 * View models of the challenge page sections fed by cross-references (#235):
 * the client case, the experts and the other challenges.
 *
 * `loadChallengeReferences` resolves the raw frontmatter values. This module
 * drops the mockup placeholders (`isPlaceholder`), as `challenge-page.ts`
 * does for the file's own sections, and keeps the page language only.
 */

import type { Language } from '~/localization/resources';
import { clean, isPlaceholder } from './challenge-page';
import type { ChallengeKey } from './challenge-schema';
import type {
  ChallengeClientCase,
  ChallengeExpert,
  OtherChallenge,
} from './content/challenge-references';

/** A bracketed span anywhere: "[Client name]: [the change in one sentence]." */
const TEMPLATE_PATTERN = /\[[^\]]*\]/;

/**
 * The mockup writes the case texts as templates that mix brackets and
 * words, so any bracketed span leaves the value unwritten.
 */
function cleanCaseText(value: string): string | null {
  return TEMPLATE_PATTERN.test(value) ? null : value;
}

export type ClientCaseMetric = { value: string; label: string };

export type ClientCaseSection = {
  headline: string;
  summary: string | null;
  /** The metrics whose value and label are both written. */
  metrics: ClientCaseMetric[];
  /** Story the link opens, `null` when the challenge names no Story. */
  storySlug: string | null;
};

export type ExpertCard = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  contribution: string | null;
  /** Tool names, in the member's order. */
  tools: string[];
  previousCompanies: string[];
};

export type OtherChallengeLink = {
  slug: string;
  key: ChallengeKey;
  name: string;
  tagline: string | null;
};

/**
 * `null` hides the section: the Story did not resolve, neither the case nor
 * its Story gives a headline, or the case has neither a Story nor a written
 * metric (a headline alone names no client). The Story title and subtitle
 * stand in for a headline and summary still written as placeholders.
 */
export function buildClientCaseSection(
  clientCase: ChallengeClientCase | null,
): ClientCaseSection | null {
  if (!clientCase) return null;
  const { story } = clientCase;
  const headline = cleanCaseText(clientCase.headline) ?? story?.title ?? null;
  if (!headline) return null;
  const metrics = clientCase.metrics.flatMap((metric) => {
    const value = cleanCaseText(metric.value);
    const label = cleanCaseText(metric.label);
    return value && label ? [{ value, label }] : [];
  });
  if (!story && metrics.length === 0) return null;
  return {
    headline,
    summary: cleanCaseText(clientCase.summary) ?? story?.subtitle ?? null,
    metrics,
    storySlug: story?.slug ?? null,
  };
}

export function buildExpertCards(
  experts: readonly ChallengeExpert[],
  lang: Language,
): ExpertCard[] {
  return experts.map((expert) => ({
    slug: expert.slug,
    name: expert.name,
    role: expert.role[lang],
    photo: expert.avatar,
    contribution: clean(expert.contribution?.[lang]),
    tools: expert.tools.map((tool) => tool.name),
    previousCompanies: (expert.previousCompanies ?? []).filter(
      (company) => !isPlaceholder(company),
    ),
  }));
}

export function buildOtherChallengeLinks(
  challenges: readonly OtherChallenge[],
): OtherChallengeLink[] {
  return challenges.map(({ slug, key, name, tagline }) => ({
    slug,
    key,
    name,
    tagline: clean(tagline),
  }));
}
