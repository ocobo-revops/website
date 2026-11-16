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
  | 'tools'
  | 'roi';

const VALID_SLUGS: Set<string> = new Set<PageSlug>([
  'technology',
  'studio',
  'jobs',
  'podcasts',
  'news',
  'tools',
  'roi',
]);

/**
 * P2+ pages disabled by default until launched. `roi` waits for the ROI page
 * (#248) and Ocobo's sign-off on its assumptions copy.
 */
export const DISABLED_PAGES_DEFAULT: PageSlug[] = ['news', 'tools', 'roi'];

/**
 * Pages not built yet: disabled whatever DISABLED_PAGES says, since that env
 * var replaces the default list. #248 removes `roi` from here when it ships
 * the ROI calculator page.
 */
const UNBUILT_PAGES: PageSlug[] = ['roi'];

/**
 * Returns the list of currently disabled page slugs.
 * Reads from DISABLED_PAGES env var, falls back to DISABLED_PAGES_DEFAULT,
 * then adds UNBUILT_PAGES. Server-only, reads process.env.
 */
export function getDisabledPages(): PageSlug[] {
  return [...new Set([...readDisabledPages(), ...UNBUILT_PAGES])];
}

function readDisabledPages(): PageSlug[] {
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
