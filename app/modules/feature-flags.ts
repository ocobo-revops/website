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
 * P2+ pages disabled by default until launched. `roi` also waits for Ocobo's
 * sign-off on its assumptions copy (#248).
 */
export const DISABLED_PAGES_DEFAULT: PageSlug[] = ['news', 'tools', 'roi'];

/**
 * Built pages waiting for Ocobo's sign-off on their copy. Production keeps
 * them off whatever DISABLED_PAGES says, since that env var replaces the
 * default list. Vercel previews and local development follow DISABLED_PAGES,
 * so the copy can be reviewed there. Remove a slug once Ocobo approves it.
 */
const AWAITING_SIGN_OFF_PAGES: PageSlug[] = ['roi'];

/**
 * True on a Vercel preview and outside production builds. Fails closed: a
 * production build without VERCEL_ENV counts as production.
 */
function isReviewEnvironment(): boolean {
  return (
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NODE_ENV !== 'production'
  );
}

/**
 * Returns the list of currently disabled page slugs.
 * Reads from DISABLED_PAGES env var, falls back to DISABLED_PAGES_DEFAULT,
 * then adds AWAITING_SIGN_OFF_PAGES in production. Server-only, reads
 * process.env.
 */
export function getDisabledPages(): PageSlug[] {
  const held = isReviewEnvironment() ? [] : AWAITING_SIGN_OFF_PAGES;
  return [...new Set([...readDisabledPages(), ...held])];
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
