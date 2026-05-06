import Markdoc from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';

import { extractFirstParagraph, extractToc, slugify } from './toc';

function parseAst(markdown: string) {
  return Markdoc.parse(markdown);
}

describe('slugify', () => {
  it('converts plain ASCII text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips French accents (é, è, à, ê, ô, û, î, ù, ç)', () => {
    expect(slugify('Évolution des méthodes')).toBe('evolution-des-methodes');
    expect(slugify('Rétrospective à chaud')).toBe('retrospective-a-chaud');
    expect(slugify('Être ou ne pas être')).toBe('etre-ou-ne-pas-etre');
  });

  it('strips special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify("L'analyse")).toBe('lanalyse');
  });

  it('collapses multiple spaces/hyphens', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('is idempotent', () => {
    const text = 'Méthodes de travail';
    expect(slugify(slugify(text))).toBe(slugify(text));
  });
});

describe('extractToc', () => {
  it('returns empty array for document with no headings', () => {
    const ast = parseAst('Just a paragraph.\n\nAnd another one.');
    expect(extractToc(ast)).toEqual([]);
  });

  it('extracts h2 headings by default', () => {
    const ast = parseAst(
      '## Introduction\n\nSome text.\n\n## Conclusion\n\nMore text.',
    );
    expect(extractToc(ast)).toEqual([
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ]);
  });

  it('extracts h2 and h3 headings by default (maxLevel=3)', () => {
    const ast = parseAst(
      '## Section\n\n### Sub-section\n\n#### Nested\n\nText.',
    );
    const toc = extractToc(ast);
    expect(toc).toHaveLength(2);
    expect(toc[0]).toMatchObject({ level: 2, id: 'section' });
    expect(toc[1]).toMatchObject({ level: 3, id: 'sub-section' });
  });

  it('excludes h1 headings', () => {
    const ast = parseAst('# Title\n\n## Section');
    const toc = extractToc(ast);
    expect(toc).toHaveLength(1);
    expect(toc[0].level).toBe(2);
  });

  it('respects maxLevel option', () => {
    const ast = parseAst('## Section\n\n### Sub-section\n\n#### Deep\n\nText.');
    const toc = extractToc(ast, 2);
    expect(toc).toHaveLength(1);
    expect(toc[0].level).toBe(2);
  });

  it('uses explicit id from Markdoc {% #id %} syntax', () => {
    const ast = parseAst('## Custom Section {% #custom-id %}');
    const toc = extractToc(ast);
    expect(toc[0]).toMatchObject({ id: 'custom-id', title: 'Custom Section' });
  });

  it('slugifies French headings with accents', () => {
    const ast = parseAst(
      '## Évolution des méthodes\n\n### Rétrospective à chaud',
    );
    const toc = extractToc(ast);
    expect(toc[0]).toMatchObject({
      id: 'evolution-des-methodes',
      title: 'Évolution des méthodes',
      level: 2,
    });
    expect(toc[1]).toMatchObject({
      id: 'retrospective-a-chaud',
      title: 'Rétrospective à chaud',
      level: 3,
    });
  });

  it('produces idempotent ids on re-runs', () => {
    const markdown = '## Méthodes et outils\n\n### Analyse';
    const ast1 = parseAst(markdown);
    const ast2 = parseAst(markdown);
    expect(extractToc(ast1)).toEqual(extractToc(ast2));
  });

  it('dedupes repeated heading text with numeric suffixes', () => {
    const ast = parseAst('## Intro\n\n## Intro\n\n## Intro');
    const toc = extractToc(ast);
    expect(toc.map((e) => e.id)).toEqual(['intro', 'intro-2', 'intro-3']);
  });

  it('preserves explicit ids and only dedupes auto-generated ones', () => {
    const ast = parseAst(
      '## Intro {% #custom %}\n\n## Intro\n\n## Intro {% #custom %}',
    );
    const toc = extractToc(ast);
    expect(toc.map((e) => e.id)).toEqual(['custom', 'intro', 'custom']);
  });
});

describe('extractFirstParagraph', () => {
  it('returns the first paragraph text', () => {
    const ast = parseAst('## Intro\n\nFirst paragraph.\n\nSecond paragraph.');
    expect(extractFirstParagraph(ast)).toBe('First paragraph.');
  });

  it('skips headings and returns first real paragraph', () => {
    const ast = parseAst('## Title\n\nThis is the intro.');
    expect(extractFirstParagraph(ast)).toBe('This is the intro.');
  });

  it('returns null when no paragraphs exist', () => {
    const ast = parseAst('## Only a heading');
    expect(extractFirstParagraph(ast)).toBeNull();
  });

  it('returns plain text without markdown inline markup', () => {
    const ast = parseAst('**Bold** and *italic* text.');
    const result = extractFirstParagraph(ast);
    expect(result).toContain('Bold');
    expect(result).toContain('italic');
  });
});
