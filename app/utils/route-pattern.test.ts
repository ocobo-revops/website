import { describe, expect, it } from 'vitest';

import { matchesToRoutePattern, routeIdToPattern } from './route-pattern';

describe('routeIdToPattern', () => {
  it.each([
    ['root index', 'routes/_main.($lang)._index', '/[lang]'],
    ['blog detail', 'routes/_main.($lang).blog.$slug', '/[lang]/blog/[slug]'],
    ['blog index (no lang)', 'routes/_main.blog._index', '/blog'],
    ['blog detail (no lang)', 'routes/_main.blog.$slug', '/blog/[slug]'],
    [
      'clients detail',
      'routes/_main.($lang).clients.$slug',
      '/[lang]/clients/[slug]',
    ],
    ['jobs index', 'routes/_main.($lang).jobs._index', '/[lang]/jobs'],
    ['static page', 'routes/_main.($lang).about-us', '/[lang]/about-us'],
    ['root without main', 'routes/_main', '/'],
    ['bracket-escaped dot', 'routes/robots[.txt]', '/robots.txt'],
    ['bracket-escaped sitemap', 'routes/sitemap[.xml]', '/sitemap.xml'],
    ['media detail (top-level dynamic)', 'routes/media.$slug', '/media/[slug]'],
    ['localised legal index', 'routes/_main.($lang).legal', '/[lang]/legal'],
    ['root index without lang', 'routes/_main._index', '/'],
    [
      'leading bracket escape with literal dot',
      'routes/[.]well-known.security[.txt]',
      '/.well-known/security.txt',
    ],
    ['param with trailing extension', 'routes/$slug[.json]', '/[slug].json'],
    [
      'optional param with trailing extension',
      'routes/($lang)[.html]',
      '/[lang].html',
    ],
  ])('%s → %s', (_label, id, expected) => {
    expect(routeIdToPattern(id)).toBe(expected);
  });

  it('handles ids without the routes/ prefix', () => {
    expect(routeIdToPattern('_main.blog.$slug')).toBe('/blog/[slug]');
  });
});

describe('matchesToRoutePattern', () => {
  it('returns the pattern derived from the last match', () => {
    const matches = [
      { id: 'root' },
      { id: 'routes/_main' },
      { id: 'routes/_main.($lang).blog.$slug' },
    ];
    expect(matchesToRoutePattern(matches)).toBe('/[lang]/blog/[slug]');
  });

  it('returns undefined for an empty matches array', () => {
    expect(matchesToRoutePattern([])).toBeUndefined();
  });
});
