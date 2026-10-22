import { describe, expect, it } from 'vitest';

import { sectionId } from './showcase-section';
import {
  designSystemPagePath,
  designSystemPages,
  findDesignSystemPage,
} from './subpages';

const pages = designSystemPages;
const sections = pages.flatMap((page) => page.sections);

describe('design system registry', () => {
  it('gives every page its own slug', () => {
    const slugs = pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('places every section on one page only', () => {
    expect(new Set(sections).size).toBe(sections.length);
  });

  it('derives a distinct anchor id for every section', () => {
    const ids = sections.map(sectionId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });
});

describe('findDesignSystemPage', () => {
  it('finds the page and its group from a pathname', () => {
    expect(findDesignSystemPage('/design-system/colours')).toMatchObject({
      group: { title: 'Foundations' },
      page: { slug: 'colours' },
    });
  });

  it('ignores a trailing slash', () => {
    expect(findDesignSystemPage('/design-system/motion/')?.page.slug).toBe(
      'motion',
    );
  });

  it('returns nothing on the index or an unknown path', () => {
    expect(findDesignSystemPage('/design-system')).toBeUndefined();
    expect(findDesignSystemPage('/design-system/unknown')).toBeUndefined();
  });

  it('builds page paths under the design system root', () => {
    expect(designSystemPagePath('bow-tie')).toBe('/design-system/bow-tie');
  });
});
