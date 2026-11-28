import type { Language } from '~/localization/resources';
import type { PageSlug } from '~/modules/feature-flags';

/** One `<url>` of the sitemap. `path` starts with `/`. */
export type SitemapEntry = {
  path: string;
  lastmod?: Date;
  /** Language of the page, for its hreflang alternates. */
  lang?: Language;
  /**
   * Path with no language prefix, shared by the translations of a page.
   * Entries with the same key list each other as hreflang alternates, so a
   * translated story, job or challenge must keep the same file name.
   */
  key?: string;
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

/** Entry for `path` in `lang`, keyed to its translations. */
export function localizedEntry(
  lang: Language,
  path: string,
  lastmod?: Date,
): SitemapEntry {
  return {
    path: localizedPath(lang, path),
    lang,
    key: path,
    ...(lastmod ? { lastmod } : {}),
  };
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
    ).map((page) => localizedEntry(lang, page.path)),
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

/** Language that `x-default` points to: French is the site default. */
const DEFAULT_LANGUAGE: Language = 'fr';

type Alternate = { hreflang: Language | 'x-default'; href: string };

/**
 * hreflang alternates per key, for keys present in more than one language.
 * Each URL of the group lists every language, itself included, plus
 * `x-default` pointing to the French URL.
 */
function alternatesByKey(
  baseUrl: string,
  entries: readonly SitemapEntry[],
): Map<string, Alternate[]> {
  const groups = new Map<string, Map<Language, string>>();
  for (const { key, lang, path } of entries) {
    if (key === undefined || lang === undefined) continue;
    const group = groups.get(key) ?? new Map<Language, string>();
    if (!group.has(lang)) group.set(lang, `${baseUrl}${path}`);
    groups.set(key, group);
  }

  const result = new Map<string, Alternate[]>();
  for (const [key, group] of groups) {
    if (group.size < 2) continue;
    const alternates = [...group].map(([hreflang, href]) => ({
      hreflang,
      href,
    }));
    const fallback = group.get(DEFAULT_LANGUAGE);
    result.set(
      key,
      fallback
        ? [...alternates, { hreflang: 'x-default', href: fallback }]
        : alternates,
    );
  }
  return result;
}

/**
 * Sitemap XML for `entries`, deduplicated on path, in input order. Pages
 * present in several languages carry `xhtml:link` hreflang alternates.
 */
export function renderSitemap(
  baseUrl: string,
  entries: readonly SitemapEntry[],
): string {
  const seen = new Set<string>();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });
  const alternates = alternatesByKey(baseUrl, unique);

  const urls = unique.map((entry) => {
    const loc = `<loc>${escapeXml(`${baseUrl}${entry.path}`)}</loc>`;
    const lastmod = isValidDate(entry.lastmod)
      ? `<lastmod>${entry.lastmod.toISOString()}</lastmod>`
      : '';
    const links = (entry.key !== undefined && alternates.get(entry.key)) || [];
    const hreflang = links
      .map(
        ({ hreflang, href }) =>
          `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
      )
      .join('');
    return `<url>${loc}${lastmod}${hreflang}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
  ].join('\n');
}
