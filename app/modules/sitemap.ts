import type { Language } from '~/localization/resources';
import type { PageSlug } from '~/modules/feature-flags';

/** One `<url>` of the sitemap. `path` starts with `/`. */
export type SitemapEntry = {
  path: string;
  lastmod?: Date;
};

/** Content folders an index page lists; empty or missing means no page. */
export type ContentKind = 'stories' | 'jobs';

type LocalizedPage = {
  path: string;
  /**
   * Feature flag that hides the page from navigation. `studio` and
   * `technology` also answer 404 when off.
   */
  flag?: PageSlug;
  /** Languages the page exists in, when not all of them. */
  only?: readonly Language[];
  /** Content the page lists: it shows an error state when there is none. */
  lists?: ContentKind;
};

export type PageFilters = {
  isEnabled: (slug: PageSlug) => boolean;
  hasContent: (kind: ContentKind, lang: Language) => boolean;
};

/**
 * Pages served under `/<lang>` in every language. Unprefixed French URLs
 * answer a 301 to `/fr/...` (`redirectWithLocale`), so the sitemap lists the
 * prefixed form only.
 */
export const LOCALIZED_PAGES: readonly LocalizedPage[] = [
  { path: '' },
  { path: '/offer' },
  { path: '/method' },
  { path: '/clients', lists: 'stories' },
  { path: '/studio', flag: 'studio' },
  { path: '/technology', flag: 'technology' },
  { path: '/about-us' },
  { path: '/jobs', flag: 'jobs', lists: 'jobs' },
  { path: '/contact' },
  // Legal pages have no English text: `/en/legal/*` serves the French one.
  { path: '/legal/confidentialite', only: ['fr'] },
  { path: '/legal/cgu', only: ['fr'] },
];

/** `/<lang><path>`, with no trailing slash on the home page. */
export function localizedPath(lang: Language, path: string): string {
  return `/${lang}${path}`;
}

/**
 * Static pages for each language, minus the ones whose flag is off, that do
 * not exist in that language, or whose listed content is empty.
 */
export function buildLocalizedPageEntries(
  languages: readonly Language[],
  { isEnabled, hasContent }: PageFilters,
): SitemapEntry[] {
  return languages.flatMap((lang) =>
    LOCALIZED_PAGES.filter(
      (page) =>
        (!page.flag || isEnabled(page.flag)) &&
        (!page.only || page.only.includes(lang)) &&
        (!page.lists || hasContent(page.lists, lang)),
    ).map((page) => ({ path: localizedPath(lang, page.path) })),
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isValidDate(date: Date | undefined): date is Date {
  return date !== undefined && !Number.isNaN(date.getTime());
}

/** Sitemap XML for `entries`, deduplicated on path, in input order. */
export function renderSitemap(
  baseUrl: string,
  entries: readonly SitemapEntry[],
): string {
  const seen = new Set<string>();
  const urls = entries
    .filter((entry) => {
      if (seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    })
    .map((entry) => {
      const loc = `<loc>${escapeXml(`${baseUrl}${entry.path}`)}</loc>`;
      const lastmod = isValidDate(entry.lastmod)
        ? `<lastmod>${entry.lastmod.toISOString()}</lastmod>`
        : '';
      return `<url>${loc}${lastmod}</url>`;
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
}
