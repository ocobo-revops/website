/**
 * Home challenge cards (#241): what each card shows, read from the challenge
 * file instead of copied into the home.
 */

import type { MarkdocFile } from '~/types';

import { isChallengeSlug } from './challenge-page';
import type { ChallengeFrontmatter, ChallengeKey } from './challenge-schema';
import { hasPlaceholder, writtenOrNull } from './content/placeholder';

export type HomeChallengeCard = {
  slug: string;
  key: ChallengeKey;
  /** Shown as the card number: "Enjeu 01". */
  order: number;
  name: string;
  /** Card title. `null` while the file holds a mockup placeholder. */
  tagline: string | null;
  quote: string | null;
  /** Workstream intro, on the back. */
  intro: string | null;
  /** Workstream titles, on the back. Placeholders are left out. */
  workstreams: string[];
};

/**
 * Cards in `order`, then by slug for a stable order. A file is published
 * when it is in the content source, so every file counts, except a slug the
 * challenge route answers 404 to (same rule as the navbar entry).
 */
export function toHomeChallengeCards(
  files: readonly MarkdocFile<ChallengeFrontmatter>[],
): HomeChallengeCard[] {
  return files
    .filter((file) => isChallengeSlug(file.slug))
    .sort(
      (a, b) =>
        a.frontmatter.order - b.frontmatter.order ||
        a.slug.localeCompare(b.slug),
    )
    .map(({ slug, frontmatter }) => ({
      slug,
      key: frontmatter.key,
      order: frontmatter.order,
      name: frontmatter.name,
      tagline: writtenOrNull(frontmatter.tagline),
      quote: writtenOrNull(frontmatter.hero.quote),
      intro: writtenOrNull(frontmatter.workstreams.intro),
      workstreams: frontmatter.workstreams.items
        .map(({ title }) => title)
        .filter((title) => !hasPlaceholder(title)),
    }));
}

/** "01" for order 1: the card number on both faces. */
export function challengeNumber(order: number): string {
  return String(order).padStart(2, '0');
}
