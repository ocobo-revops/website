/**
 * View model of a challenge page (#233, #234, #236): the sections of the page,
 * built from a validated challenge frontmatter.
 *
 * A mockup placeholder (any bracketed span, `content/placeholder.ts`) never
 * renders. A section whose required text is a placeholder, or whose items are
 * all placeholders, is `null` and the page leaves it out. The hero always
 * renders: it holds the page's `h1`, which falls back to the challenge name.
 */

import type { StageId } from './bowtie-stages';
import type { ChallengeFrontmatter, ChallengeKey } from './challenge-schema';
import { hasPlaceholder } from './content/placeholder';

/** Kebab-case, as the posts repo names challenge files. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isChallengeSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/** Same rule as `hasPlaceholder`, kept for the existing call sites. */
export function isPlaceholder(value: string): boolean {
  return hasPlaceholder(value);
}

/** The value, or `null` when it is missing or a mockup placeholder. */
export function clean(value: string | undefined): string | null {
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

export type ChallengeWorkstream = {
  category: string | null;
  step: number | null;
  title: string;
  description: string | null;
  deliverable: string;
  note: string | null;
};

export type ChallengeWorkstreams = {
  /** The file's override of the locale heading, `null` for the default. */
  title: string | null;
  intro: string | null;
  items: ChallengeWorkstream[];
};

export type ChallengeMethodStep = {
  /** The file's override of the locale step title, `null` for the default. */
  title: string | null;
  text: string | null;
};

export type ChallengeMethod = {
  /** The file's override of the locale heading, `null` for the default. */
  title: string | null;
  subtitle: string | null;
  /** Always three: the position picks the locale step title. */
  steps: ChallengeMethodStep[];
  /** Tool slugs, resolved against the Tool files by the loader. */
  tools: string[];
  note: string | null;
};

export type ChallengeDiagnostic = {
  question: string;
  subtitle: string | null;
  /** The hero CTA label, `null` to fall back on the locale default. */
  cta: string | null;
};

type ChallengeDemo = NonNullable<ChallengeFrontmatter['aiBridge']['demo']>;

export type ChallengeDemoElement = ChallengeDemo['elements'][number];

/** The agent window, rendered as written: Zod already caps every text. */
export type ChallengeAgentDemo = Omit<ChallengeDemo, 'note'> & {
  note: string | null;
};

export type ChallengeAiBridge = {
  title: string;
  bullets: string[];
  demo: ChallengeAgentDemo | null;
};

export type ChallengePage = {
  key: ChallengeKey;
  order: number;
  name: string;
  tagline: string | null;
  hero: ChallengeHero;
  symptoms: ChallengeSymptoms | null;
  audience: ChallengeAudienceItem[] | null;
  workstreams: ChallengeWorkstreams | null;
  method: ChallengeMethod | null;
  diagnostic: ChallengeDiagnostic | null;
  aiBridge: ChallengeAiBridge | null;
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

/** A card needs its title on the front and its deliverable on the back. */
function buildWorkstreams({
  workstreams,
}: ChallengeFrontmatter): ChallengeWorkstreams | null {
  const items = workstreams.items.flatMap((item) => {
    const title = clean(item.title);
    const deliverable = clean(item.deliverable);
    if (!title || !deliverable) return [];
    return [
      {
        category: clean(item.category),
        step: item.step ?? null,
        title,
        description: clean(item.description),
        deliverable,
        note: clean(item.note),
      },
    ];
  });
  if (items.length === 0) return null;
  return {
    title: clean(workstreams.title),
    intro: clean(workstreams.intro),
    items,
  };
}

/**
 * The heading and step titles come from `locales/`, so the section needs at
 * least one step text from the file to say anything about this challenge.
 */
function buildMethod({ method }: ChallengeFrontmatter): ChallengeMethod | null {
  const steps = method.steps.map((step) => ({
    title: clean(step.title),
    text: clean(step.text),
  }));
  if (steps.every((step) => step.text === null)) return null;
  return {
    title: clean(method.title),
    subtitle: clean(method.subtitle),
    steps,
    tools: cleanList(method.tools),
    note: clean(method.note),
  };
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

function elementHasPlaceholder(element: ChallengeDemoElement): boolean {
  switch (element.type) {
    case 'kpis':
      return element.items.some(
        (item) => isPlaceholder(item.value) || isPlaceholder(item.label),
      );
    case 'figure':
      return isPlaceholder(element.value) || isPlaceholder(element.caption);
    case 'progress':
      return false;
    case 'status':
      return isPlaceholder(element.label) || isPlaceholder(element.value);
    case 'buttons':
      return element.labels.some(isPlaceholder);
  }
}

/**
 * The window needs its frame texts and at least one element; an element
 * with a placeholder drops out on its own.
 */
function buildDemo(demo: ChallengeDemo | undefined): ChallengeAgentDemo | null {
  if (!demo) return null;
  const frame = [demo.channel, demo.agent, demo.opening.text, demo.footer];
  if (frame.some(isPlaceholder)) return null;
  const elements = demo.elements.filter(
    (element) => !elementHasPlaceholder(element),
  );
  if (elements.length === 0) return null;
  return { ...demo, elements, note: clean(demo.note) };
}

function buildAiBridge({
  aiBridge,
}: ChallengeFrontmatter): ChallengeAiBridge | null {
  const title = clean(aiBridge.title);
  const bullets = cleanList(aiBridge.bullets);
  if (!title || bullets.length === 0) return null;
  return { title, bullets, demo: buildDemo(aiBridge.demo) };
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
    workstreams: buildWorkstreams(frontmatter),
    method: buildMethod(frontmatter),
    diagnostic: buildDiagnostic(frontmatter),
    aiBridge: buildAiBridge(frontmatter),
  };
}
