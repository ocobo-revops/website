/**
 * View models of the challenge page sections fed by cross-references (#235):
 * the method tools, the partner, the client case and the experts.
 *
 * `loadChallengeReferences` resolves the references and drops the mockup
 * placeholders. The loader maps them here and returns this output only, so
 * the page data holds the page language and the fields the sections show.
 */

import type { Language } from '~/localization/resources';
import type {
  ChallengeClientCase,
  ChallengeExpert,
  ChallengePartner,
  ChallengeReferences,
} from './content/challenge-references';
import type { Tool } from './content/tools';

export type ClientCaseMetric = { value: string; label: string };

export type ClientCaseSection = {
  headline: string;
  summary: string | null;
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

export type ChallengeReferenceSections = {
  methodTools: Tool[];
  /** Resolved partner, for the partner block (#236). */
  partner: ChallengePartner | null;
  clientCase: ClientCaseSection | null;
  experts: ExpertCard[];
};

export function buildClientCaseSection(
  clientCase: ChallengeClientCase | null,
): ClientCaseSection | null {
  if (!clientCase) return null;
  const { headline, summary, metrics, story } = clientCase;
  return {
    headline,
    summary,
    metrics: metrics.map(({ value, label }) => ({ value, label })),
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
    contribution: expert.contribution[lang],
    tools: expert.tools.map((tool) => tool.name),
    previousCompanies: expert.previousCompanies,
  }));
}

export function buildChallengeReferenceSections(
  references: ChallengeReferences,
  lang: Language,
): ChallengeReferenceSections {
  return {
    methodTools: references.methodTools,
    partner: references.partner,
    clientCase: buildClientCaseSection(references.clientCase),
    experts: buildExpertCards(references.experts, lang),
  };
}
