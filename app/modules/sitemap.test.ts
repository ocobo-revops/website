import { describe, expect, it } from 'vitest';

import type { PageSlug } from '~/modules/feature-flags';

import {
  LOCALIZED_PAGES,
  buildLocalizedPageEntries,
  localizedEntry,
  localizedPath,
  renderSitemap,
} from './sitemap';

const everything = { isEnabled: () => true, hasContent: () => true };

describe('localizedPath', () => {
  it('prefixes the path with the language', () => {
    expect(localizedPath('fr', '/offer')).toBe('/fr/offer');
    expect(localizedPath('en', '/clients/acme')).toBe('/en/clients/acme');
  });

  it('gives the home page with no trailing slash', () => {
    expect(localizedPath('en', '')).toBe('/en');
  });
});

describe('localizedEntry', () => {
  it('keys the entry on the path with no language', () => {
    expect(localizedEntry('en', '/offer')).toEqual({
      path: '/en/offer',
      lang: 'en',
      key: '/offer',
    });
  });

  it('keeps the lastmod when given', () => {
    const lastmod = new Date('2024-03-15T00:00:00Z');
    expect(localizedEntry('fr', '/clients/acme', lastmod).lastmod).toBe(
      lastmod,
    );
  });
});

describe('buildLocalizedPageEntries', () => {
  it('lists every French page', () => {
    const paths = buildLocalizedPageEntries(['fr'], everything).map(
      (entry) => entry.path,
    );

    expect(paths).toHaveLength(LOCALIZED_PAGES.length);
    expect(paths).toContain('/fr');
    expect(paths).toContain('/fr/clients');
    expect(paths).toContain('/fr/studio');
    expect(paths).toContain('/fr/legal/cgu');
  });

  it('lists English pages, minus the French-only legal pages', () => {
    const paths = buildLocalizedPageEntries(['en'], everything).map(
      (entry) => entry.path,
    );

    expect(paths).toContain('/en');
    expect(paths).toContain('/en/clients');
    expect(paths).toContain('/en/technology');
    expect(paths.some((path) => path.startsWith('/en/legal'))).toBe(false);
  });

  it('drops index pages whose content is empty in that language', () => {
    const paths = buildLocalizedPageEntries(['fr', 'en'], {
      isEnabled: () => true,
      hasContent: (kind, lang) => kind === 'stories' && lang === 'fr',
    }).map((entry) => entry.path);

    expect(paths).toContain('/fr/clients');
    expect(paths).not.toContain('/en/clients');
    expect(paths).not.toContain('/fr/jobs');
    expect(paths).not.toContain('/en/jobs');
  });

  it('never lists the legacy stories path', () => {
    const paths = buildLocalizedPageEntries(['fr', 'en'], everything).map(
      (entry) => entry.path,
    );
    expect(paths.some((path) => path.includes('/stories'))).toBe(false);
  });

  it('drops pages whose feature flag is off', () => {
    const disabled = new Set<PageSlug>(['studio', 'jobs']);
    const paths = buildLocalizedPageEntries(['fr'], {
      isEnabled: (slug) => !disabled.has(slug),
      hasContent: () => true,
    }).map((entry) => entry.path);

    expect(paths).not.toContain('/fr/studio');
    expect(paths).not.toContain('/fr/jobs');
    expect(paths).toContain('/fr/technology');
  });
});

describe('renderSitemap', () => {
  it('uses the sitemaps.org namespace', () => {
    const xml = renderSitemap('https://example.test', []);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    );
  });

  it('writes the lastmod only when the date is valid', () => {
    const xml = renderSitemap('https://example.test', [
      { path: '/a', lastmod: new Date('2024-03-15T00:00:00Z') },
      { path: '/b', lastmod: new Date('not a date') },
      { path: '/c' },
    ]);

    expect(xml).toContain(
      '<url><loc>https://example.test/a</loc><lastmod>2024-03-15T00:00:00.000Z</lastmod></url>',
    );
    expect(xml).toContain('<url><loc>https://example.test/b</loc></url>');
    expect(xml).toContain('<url><loc>https://example.test/c</loc></url>');
  });

  it('keeps the first entry of a duplicated path', () => {
    const xml = renderSitemap('https://example.test', [
      { path: '/a' },
      { path: '/a', lastmod: new Date('2024-03-15T00:00:00Z') },
    ]);
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).not.toContain('<lastmod>');
  });

  it('escapes XML special characters', () => {
    const xml = renderSitemap('https://example.test', [{ path: '/a?x=1&y=2' }]);
    expect(xml).toContain('<loc>https://example.test/a?x=1&amp;y=2</loc>');
  });

  it('links the translations of a page as hreflang alternates', () => {
    const xml = renderSitemap('https://example.test', [
      localizedEntry('fr', '/offer'),
      localizedEntry('en', '/offer'),
    ]);
    const links = [
      '<xhtml:link rel="alternate" hreflang="fr" href="https://example.test/fr/offer"/>',
      '<xhtml:link rel="alternate" hreflang="en" href="https://example.test/en/offer"/>',
      '<xhtml:link rel="alternate" hreflang="x-default" href="https://example.test/fr/offer"/>',
    ].join('');

    expect(xml).toContain(
      `<url><loc>https://example.test/fr/offer</loc>${links}</url>`,
    );
    expect(xml).toContain(
      `<url><loc>https://example.test/en/offer</loc>${links}</url>`,
    );
  });

  it('writes no alternates for a page in one language only', () => {
    const xml = renderSitemap('https://example.test', [
      localizedEntry('fr', '/legal/cgu'),
      { path: '/blog/hello' },
    ]);
    expect(xml).not.toContain('<xhtml:link');
  });
});
