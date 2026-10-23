/**
 * Navbar challenge entry (#237): the published challenges of one language,
 * reduced to what the menu shows. Every page loads this list through the
 * `_main` layout, so it carries no more than the menu needs.
 */

import type { MarkdocFile } from '~/types';

import { isChallengeSlug } from './challenge-page';
import type { ChallengeFrontmatter, ChallengeKey } from './challenge-schema';
import { hasPlaceholder } from './content/placeholder';

export type ChallengeMenuEntry = {
  slug: string;
  key: ChallengeKey;
  name: string;
  /** `null` when the file still holds a mockup placeholder. */
  tagline: string | null;
};

/**
 * Menu entries in `order`, then by slug for a stable order. A file is published when it is in the content
 * source, so every file counts, except a slug the challenge route answers
 * 404 to.
 */
export function toChallengeMenu(
  files: readonly MarkdocFile<ChallengeFrontmatter>[],
): ChallengeMenuEntry[] {
  return files
    .filter((file) => isChallengeSlug(file.slug))
    .sort(
      (a, b) =>
        a.frontmatter.order - b.frontmatter.order ||
        a.slug.localeCompare(b.slug),
    )
    .map(({ slug, frontmatter: { key, name, tagline } }) => ({
      slug,
      key,
      name,
      tagline: hasPlaceholder(tagline) ? null : tagline,
    }));
}

/** Route id of `app/routes/_main.tsx`, which loads the list. */
export const MAIN_ROUTE_ID = 'routes/_main';

/**
 * Whether the `_main` layout loader reported a failed challenge load, from
 * the loader data of a server render. Such a page must not be cached.
 */
export function didMainChallengeLoadFail(
  loaderData: Record<string, unknown>,
): boolean {
  const main = loaderData[MAIN_ROUTE_ID];
  return (
    typeof main === 'object' &&
    main !== null &&
    'failed' in main &&
    main.failed === true
  );
}

/**
 * The menu without the current challenge: the "other challenges" block of a
 * challenge page (#235) and any link to a sibling challenge (#236).
 */
export function otherChallenges(
  menu: readonly ChallengeMenuEntry[],
  currentSlug: string,
): ChallengeMenuEntry[] {
  return menu.filter(({ slug }) => slug !== currentSlug);
}
