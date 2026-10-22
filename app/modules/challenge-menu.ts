/**
 * Navbar challenge entry (#237): the published challenges of one language,
 * reduced to what the menu shows. Every page loads this list through the
 * `_main` layout, so it carries no more than the menu needs.
 */

import type { MarkdocFile } from '~/types';

import { isChallengeSlug, isPlaceholder } from './challenge-page';
import type { ChallengeFrontmatter, ChallengeKey } from './challenge-schema';

export type ChallengeMenuEntry = {
  slug: string;
  key: ChallengeKey;
  name: string;
  /** `null` when the file still holds a mockup placeholder. */
  tagline: string | null;
};

/**
 * Menu entries in `order`. A file is published when it is in the content
 * source, so every file counts, except a slug the challenge route answers
 * 404 to.
 */
export function toChallengeMenu(
  files: readonly MarkdocFile<ChallengeFrontmatter>[],
): ChallengeMenuEntry[] {
  return files
    .filter((file) => isChallengeSlug(file.slug))
    .sort((a, b) => a.frontmatter.order - b.frontmatter.order)
    .map(({ slug, frontmatter: { key, name, tagline } }) => ({
      slug,
      key,
      name,
      tagline: isPlaceholder(tagline) ? null : tagline,
    }));
}
