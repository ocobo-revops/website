/**
 * Challenge frontmatter schema: one file per challenge in
 * `challenges/<lang>/<slug>.md`, frontmatter only.
 *
 * Mirrors the schema of the posts repo (`scripts/schemas/challenge.schema.js`:
 * core fields from ocobo-revops/posts#94, partner block from posts#97, agent
 * window from posts#96). The website must accept every file the posts repo
 * accepts, so both schemas change in the same pair of PRs.
 */

import { z } from 'zod';

import { STAGE_IDS } from './bowtie-stages';

/**
 * Caps are character counts measured on the French mockup text: the longest
 * value in the six mockups plus about 20%. The error states the overage the
 * author has to cut.
 */
const cappedText = (cap: number) =>
  z
    .string()
    .trim()
    .min(1, { error: 'must not be empty' })
    .max(cap, {
      error: (issue) => {
        const length = String(issue.input).length;
        return `${length} characters, cap ${cap} (${length - cap} over)`;
      },
    });

/** Slugs carry no cap: they never render as text. */
const slug = z.string().trim().min(1, { error: 'must not be empty' });

export const CHALLENGE_KEYS = ['rp', 'se', 'sc', 'cx', 'sy', 'ai'] as const;

export type ChallengeKey = (typeof CHALLENGE_KEYS)[number];

const activeStages = z
  .array(z.enum(STAGE_IDS))
  .min(1)
  .max(STAGE_IDS.length)
  .refine((stages) => new Set(stages).size === stages.length, {
    message: 'Stage ids must be unique',
  });

const workstream = z.strictObject({
  category: cappedText(26),
  step: z.number().int().min(1).max(6).optional(),
  title: cappedText(64),
  description: cappedText(210),
  deliverable: cappedText(170),
  note: cappedText(100).optional(),
});

const percentage = z.number().int().min(0).max(100);

/**
 * Agent window: a frame and up to four typed body elements, rendered in
 * order. Every mockup window has four.
 */
const demoElement = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('kpis'),
    items: z
      .array(
        z.strictObject({
          value: cappedText(10),
          label: cappedText(16),
        }),
      )
      .length(3),
  }),
  z.strictObject({
    type: z.literal('figure'),
    value: cappedText(12),
    caption: cappedText(48),
  }),
  z.strictObject({
    type: z.literal('progress'),
    percent: percentage,
    target: percentage.optional(),
  }),
  z.strictObject({
    type: z.literal('status'),
    label: cappedText(24),
    value: cappedText(32),
    state: z.enum(['ok', 'alert']),
  }),
  z.strictObject({
    type: z.literal('buttons'),
    labels: z.array(cappedText(20)).min(1).max(2),
  }),
]);

const demo = z.strictObject({
  channel: cappedText(28),
  agent: cappedText(24),
  /**
   * Not trimmed: a fixed-format value, compared exactly between the French
   * and English files. The posts repo parses YAML 1.1, which reads an
   * unquoted 14:32 as the base 60 number 872, hence the hint.
   */
  time: z
    .string({
      error: (issue) =>
        typeof issue.input === 'number'
          ? 'quote the time, e.g. "14:32"'
          : undefined,
    })
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: 'must be a 24-hour time, HH:MM',
    }),
  opening: z.strictObject({
    /** A question renders in quotes, a statement as plain agent text. */
    kind: z.enum(['question', 'statement']),
    text: cappedText(70),
  }),
  elements: z.array(demoElement).min(1).max(4),
  footer: cappedText(60),
  /** Shown under the window (fictional accounts). */
  note: cappedText(90).optional(),
});

/**
 * Open to every challenge (ADR 0002). The logo comes from the Tool file, and
 * the figures belong to the partner, so their source is required.
 */
const partner = z.strictObject({
  tool: slug,
  sentence: cappedText(140),
  metrics: z
    .array(
      z.strictObject({
        before: cappedText(12),
        after: cappedText(12),
        label: cappedText(90),
      }),
    )
    .length(2),
  source: cappedText(90),
});

/**
 * Strict at every level: an unknown key (for example `extraSections`) fails
 * validation instead of being dropped.
 */
export const ChallengeFrontmatterSchema = z.strictObject({
  key: z.enum(CHALLENGE_KEYS),
  order: z.number().int().min(1).max(6),
  name: cappedText(30),
  tagline: cappedText(60),
  hero: z.strictObject({
    title: z.tuple([cappedText(34), cappedText(42)]),
    quote: cappedText(80),
    lead: cappedText(240),
    highlight: cappedText(110),
    cta: cappedText(48),
  }),
  bowtie: z.strictObject({
    activeStages,
    caption: cappedText(140),
  }),
  symptoms: z.strictObject({
    title: z.tuple([cappedText(64), cappedText(44)]),
    items: z.array(cappedText(130)).min(5).max(6),
  }),
  audience: z
    .array(
      z.strictObject({
        team: cappedText(20),
        roles: cappedText(30),
        benefit: cappedText(100),
      }),
    )
    .length(4),
  workstreams: z.strictObject({
    /** Optional override of the heading from `locales/` (#234 decides). */
    title: cappedText(50).optional(),
    intro: cappedText(120),
    items: z.array(workstream).min(4).max(6),
  }),
  partner: partner.optional(),
  aiBridge: z.strictObject({
    title: cappedText(92),
    bullets: z.array(cappedText(125)).length(3),
    /** Revenue AI has no agent window. */
    demo: demo.optional(),
  }),
  method: z.strictObject({
    /** Optional override of the heading from `locales/` (#234 decides). */
    title: cappedText(30).optional(),
    subtitle: cappedText(75),
    steps: z
      .array(
        z.strictObject({
          /** Optional override of the step title from `locales/`. */
          title: cappedText(28).optional(),
          text: cappedText(150),
        }),
      )
      .length(3),
    /**
     * Tool slugs. Spec #91 says 0 to 6, but two mockups exceed it, logos
     * included (Sales Experience 9, Revenue Systems 7), so the cap is the
     * largest mockup count. Keep it in step with the posts repo.
     */
    tools: z.array(slug).max(9),
    note: cappedText(170),
  }),
  case: z.strictObject({
    /** Story slug, optional until the Revenue AI client case has a Story. */
    story: slug.optional(),
    /**
     * Spec #91 says 90. The Revenue AI headline is 98 characters, so the cap
     * follows the spec's own rule: longest mockup value plus about 20%.
     */
    headline: cappedText(120),
    summary: cappedText(220),
    metrics: z
      .array(
        z.strictObject({
          value: cappedText(12),
          label: cappedText(90),
        }),
      )
      .length(2),
  }),
  diagnostic: z.strictObject({
    question: cappedText(88),
    subtitle: cappedText(125),
  }),
});

export type ChallengeFrontmatter = z.infer<typeof ChallengeFrontmatterSchema>;
