/**
 * Feature flag system for controlling page visibility.
 *
 * Pages listed in DISABLED_PAGES env var (comma-separated) are hidden
 * from navigation and return 404 from route loaders.
 */

export type PageSlug =
  | 'technology'
  | 'studio'
  | 'jobs'
  | 'podcasts'
  | 'news'
  | 'tools';

const VALID_SLUGS: Set<string> = new Set<PageSlug>([
  'technology',
  'studio',
  'jobs',
  'podcasts',
  'news',
  'tools',
]);

/** P2+ pages disabled by default until launched */
export const DISABLED_PAGES_DEFAULT: PageSlug[] = [
  'technology',
  'studio',
  'jobs',
  'podcasts',
  'news',
  'tools',
];

/**
 * Returns the list of currently disabled page slugs.
 * Reads from DISABLED_PAGES env var, falls back to DISABLED_PAGES_DEFAULT.
 * Server-only — reads process.env.
 */
export function getDisabledPages(): PageSlug[] {
  const raw = process.env.DISABLED_PAGES;
  if (raw === undefined) {
    return DISABLED_PAGES_DEFAULT;
  }
  if (raw.trim() === '') {
    return [];
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is PageSlug => VALID_SLUGS.has(s));
}

/**
 * Check whether a page is enabled (not in the disabled list).
 * Server-only.
 */
export function isPageEnabled(slug: PageSlug): boolean {
  return !getDisabledPages().includes(slug);
}

/**
 * Throw a 404 Response if a page is disabled.
 * Use in route loaders for P2+ pages.
 */
export function throwIfDisabled(slug: PageSlug): void {
  if (!isPageEnabled(slug)) {
    throw new Response('Not Found', { status: 404 });
  }
}
