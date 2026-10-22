/**
 * View model of a challenge page (#233): the four sections of the page,
 * built from a validated challenge frontmatter.
 *
 * A mockup placeholder (a value written as `[...]`) never renders. A section
 * whose required text is a placeholder, or whose items are all placeholders,
 * is `null` and the page leaves it out. The hero always renders: it holds the
 * page's `h1`, which falls back to the challenge name.
 */

import type { StageId } from './bowtie-stages';
import type { ChallengeFrontmatter, ChallengeKey } from './challenge-schema';

/** Kebab-case, as the posts repo names challenge files. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PLACEHOLDER_PATTERN = /^\s*\[.*\]\s*$/s;

export function isChallengeSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value);
}

/** The value, or `null` when it is missing or a mockup placeholder. */
function clean(value: string | undefined): string | null {
  if (value === undefined || isPlaceholder(value)) return null;
  return value;
}

function cleanList(values: readonly string[]): string[] {
  return values.filter((value) => !isPlaceholder(value));
}

export type ChallengeHero = {
  title: string;
  titleMuted: string | null;
  quote: string | null;
  lead: string | null;
  highlight: string | null;
  cta: string | null;
  activeStages: StageId[];
  caption: string | null;
};

export type ChallengeSymptoms = {
  title: string;
  titleMuted: string | null;
  items: string[];
};

export type ChallengeAudienceItem = {
  team: string | null;
  roles: string;
  benefit: string | null;
};

export type ChallengeDiagnostic = {
  question: string;
  subtitle: string | null;
  /** The hero CTA label, `null` to fall back on the locale default. */
  cta: string | null;
};

export type ChallengePage = {
  key: ChallengeKey;
  order: number;
  name: string;
  tagline: string | null;
  hero: ChallengeHero;
  symptoms: ChallengeSymptoms | null;
  audience: ChallengeAudienceItem[] | null;
  diagnostic: ChallengeDiagnostic | null;
};

function buildHero({
  hero,
  bowtie,
  name,
}: ChallengeFrontmatter): ChallengeHero {
  const title = clean(hero.title[0]);
  return {
    title: title ?? name,
    // The second line completes the first: it goes with a missing title.
    titleMuted: title ? clean(hero.title[1]) : null,
    quote: clean(hero.quote),
    lead: clean(hero.lead),
    highlight: clean(hero.highlight),
    cta: clean(hero.cta),
    activeStages: [...bowtie.activeStages],
    caption: clean(bowtie.caption),
  };
}

function buildSymptoms({
  symptoms,
}: ChallengeFrontmatter): ChallengeSymptoms | null {
  const title = clean(symptoms.title[0]);
  const items = cleanList(symptoms.items);
  if (!title || items.length === 0) return null;
  return { title, titleMuted: clean(symptoms.title[1]), items };
}

function buildAudience({
  audience,
}: ChallengeFrontmatter): ChallengeAudienceItem[] | null {
  const items = audience.flatMap((entry) => {
    const roles = clean(entry.roles);
    if (!roles) return [];
    return [{ team: clean(entry.team), roles, benefit: clean(entry.benefit) }];
  });
  return items.length > 0 ? items : null;
}

function buildDiagnostic({
  diagnostic,
  hero,
}: ChallengeFrontmatter): ChallengeDiagnostic | null {
  const question = clean(diagnostic.question);
  if (!question) return null;
  return {
    question,
    subtitle: clean(diagnostic.subtitle),
    cta: clean(hero.cta),
  };
}

export function buildChallengePage(
  frontmatter: ChallengeFrontmatter,
): ChallengePage {
  return {
    key: frontmatter.key,
    order: frontmatter.order,
    name: frontmatter.name,
    tagline: clean(frontmatter.tagline),
    hero: buildHero(frontmatter),
    symptoms: buildSymptoms(frontmatter),
    audience: buildAudience(frontmatter),
    diagnostic: buildDiagnostic(frontmatter),
  };
}
