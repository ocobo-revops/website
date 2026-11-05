// @vitest-environment node

import Markdoc, { type RenderableTreeNode, Tag } from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { config, createMarkdocConfig } from '../config';
import {
  constructFilePath,
  createValidator,
  mapStatusToState,
  normalizeSlug,
  processMarkdownContent,
} from './processor';
import type { ContentValidator } from './types';

const NBSP = String.fromCharCode(0xa0);

const ThingSchema = z.object({
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  date: z.unknown().optional(),
  draft: z.unknown().optional(),
  ignore: z.boolean().optional(),
  meta: z
    .object({
      author: z.object({ name: z.string() }),
      tags: z.array(z.string()),
    })
    .optional(),
});
type Thing = z.infer<typeof ThingSchema>;

const thingValidator = createValidator<Thing>(ThingSchema, 'Thing');

const OptionalSchema = z.object({ title: z.string().optional() });
const optionalValidator = createValidator<z.infer<typeof OptionalSchema>>(
  OptionalSchema,
  'Optional',
);

function withFrontmatter(yaml: string, body = 'Body text.'): string {
  return `---\n${yaml}\n---\n\n${body}`;
}

function process(markdown: string, slug = 'post.md') {
  return processMarkdownContent(markdown, slug, thingValidator, config);
}

function collectTagNames(node: RenderableTreeNode): string[] {
  if (!Tag.isTag(node)) return [];
  return [node.name, ...node.children.flatMap(collectTagNames)];
}

function collectTags(node: RenderableTreeNode, name: string): Tag[] {
  if (!Tag.isTag(node)) return [];
  const own = node.name === name ? [node] : [];
  return [...own, ...node.children.flatMap((c) => collectTags(c, name))];
}

describe('processMarkdownContent: valid frontmatter', () => {
  it('returns the parsed frontmatter, normalised slug, markdown and tree', () => {
    const markdown = withFrontmatter('title: Hello', '# Heading');
    const result = process(markdown, 'hello.md');

    expect(result.success).toBe(true);
    expect(result.ignored).toBeUndefined();
    expect(result.data?.slug).toBe('hello');
    expect(result.data?.frontmatter).toEqual({ title: 'Hello' });
    expect(result.data?.markdown).toBe(markdown);
    expect(collectTagNames(result.data?.content ?? null)).toEqual([
      'Container',
      'Heading',
    ]);
  });

  it('keeps dates as strings instead of coercing them to Date', () => {
    const result = process(withFrontmatter('title: T\ndate: 2024-01-15'));

    expect(result.data?.frontmatter.date).toBe('2024-01-15');
  });

  it('keeps an empty string and turns a bare key into null', () => {
    const result = process(withFrontmatter('title: T\nsubtitle: ""'));
    const bare = process(withFrontmatter('title: T\nsubtitle:'));

    expect(result.data?.frontmatter.subtitle).toBe('');
    expect(bare.data?.frontmatter.subtitle).toBeNull();
  });

  it('parses nested objects and lists', () => {
    const yaml = [
      'title: T',
      'meta:',
      '  author:',
      '    name: Ada',
      '  tags:',
      '    - revops',
      '    - crm',
    ].join('\n');
    const result = process(withFrontmatter(yaml));

    expect(result.data?.frontmatter.meta).toEqual({
      author: { name: 'Ada' },
      tags: ['revops', 'crm'],
    });
  });

  it('reads YAML 1.1 booleans like "yes" as strings (core schema)', () => {
    const yes = process(withFrontmatter('title: T\ndraft: yes'));
    const real = process(withFrontmatter('title: T\ndraft: true'));

    expect(yes.data?.frontmatter.draft).toBe('yes');
    expect(real.data?.frontmatter.draft).toBe(true);
  });

  it('treats a missing or empty frontmatter block as an empty object', () => {
    const none = processMarkdownContent(
      'Just a body.',
      'none.md',
      optionalValidator,
      config,
    );
    const empty = processMarkdownContent(
      '---\n---\n\nJust a body.',
      'empty.md',
      optionalValidator,
      config,
    );

    expect(none.success).toBe(true);
    expect(none.data?.frontmatter).toEqual({});
    expect(empty.success).toBe(true);
    expect(empty.data?.frontmatter).toEqual({});
  });

  it('assigns unique ids to repeated headings', () => {
    const result = process(withFrontmatter('title: T', '## Intro\n\n## Intro'));
    const ids = collectTags(result.data?.content ?? null, 'Heading').map(
      (tag) => tag.attributes.id,
    );

    expect(ids).toEqual(['intro', 'intro-2']);
  });

  it('applies the locale config passed in (French typography)', () => {
    const result = processMarkdownContent(
      withFrontmatter('title: T', 'Bonjour !'),
      'fr.md',
      thingValidator,
      createMarkdocConfig('fr'),
    );
    const [paragraph] = collectTags(result.data?.content ?? null, 'Paragraph');

    expect(paragraph.children).toEqual([`Bonjour${NBSP}!`]);
  });
});

describe('processMarkdownContent: malformed frontmatter', () => {
  it('fails on invalid YAML syntax', () => {
    const result = process(withFrontmatter('title: [unclosed'));

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toEqual(expect.any(String));
    expect(result.error).not.toBe('');
  });

  it('fails when a required field is missing, naming the field', () => {
    const result = process(withFrontmatter('subtitle: no title'));

    expect(result.success).toBe(false);
    expect(result.error).toMatch(
      /^Invalid Thing frontmatter\. Issues: title: /,
    );
  });

  it('reports a scalar frontmatter as a root issue', () => {
    const result = process(withFrontmatter('just a string'));

    expect(result.success).toBe(false);
    expect(result.error).toContain('Issues: root: ');
  });

  it('joins nested issue paths with dots', () => {
    const yaml = 'title: T\nmeta:\n  author:\n    name: 42\n  tags: []';
    const result = process(withFrontmatter(yaml));

    expect(result.success).toBe(false);
    expect(result.error).toContain('meta.author.name: ');
  });

  it('prefixes each issue with the context when one is given', () => {
    const result = processMarkdownContent(
      withFrontmatter('subtitle: x'),
      'post.md',
      thingValidator,
      config,
      { context: 'Filesystem:Thing' },
    );

    expect(result.error).toContain('Issues: [Filesystem:Thing] title: ');
  });

  it('re-throws the invariant when isValid disagrees with the schema', () => {
    const strict: ContentValidator<Thing> = {
      isValid: (_data: unknown): _data is Thing => false,
      schema: ThingSchema,
      typeName: 'Thing',
    };
    const result = processMarkdownContent(
      withFrontmatter('title: T'),
      'post.md',
      strict,
      config,
    );

    expect(result.success).toBe(false);
    // tiny-invariant keeps the message outside production builds only.
    expect(result.error).toBe(
      'Invariant failed: Invalid frontmatter for Thing',
    );
  });

  it('stringifies a non-Error thrown value', () => {
    const throwing: ContentValidator<Thing> = {
      isValid: (_data: unknown): _data is Thing => {
        throw 'boom';
      },
      schema: ThingSchema,
      typeName: 'Thing',
    };
    const result = processMarkdownContent(
      withFrontmatter('title: T'),
      'post.md',
      throwing,
      config,
    );

    expect(result).toEqual({ success: false, error: 'boom' });
  });
});

describe('processMarkdownContent: ignore flag', () => {
  it('returns ignored without data when the flag is respected', () => {
    const result = processMarkdownContent(
      withFrontmatter('title: T\nignore: true'),
      'post.md',
      thingValidator,
      config,
      { respectIgnoreFlag: true },
    );

    expect(result).toEqual({ success: true, ignored: true });
  });

  it('processes an ignored file when the flag is not respected', () => {
    const result = process(withFrontmatter('title: T\nignore: true'));

    expect(result.ignored).toBeUndefined();
    expect(result.data?.frontmatter.ignore).toBe(true);
  });

  it('processes a file with ignore: false even when the flag is respected', () => {
    const result = processMarkdownContent(
      withFrontmatter('title: T\nignore: false'),
      'post.md',
      thingValidator,
      config,
      { respectIgnoreFlag: true },
    );

    expect(result.ignored).toBeUndefined();
    expect(result.data?.slug).toBe('post');
  });
});

describe('processMarkdownContent: unsafe input', () => {
  it('keeps raw HTML as escaped text, never as elements', () => {
    const body = '<script>alert(1)</script>\n\nHi <img src=x onerror=alert(1)>';
    const result = process(withFrontmatter('title: T', body));
    const content = result.data?.content ?? null;

    expect(collectTagNames(content)).toEqual([
      'Container',
      'Paragraph',
      'Paragraph',
    ]);
    const html = Markdoc.renderers.html(content);
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
  });

  it('does not turn javascript: URLs into links', () => {
    const body = [
      '[a](javascript:alert(1))',
      '[b](JaVaScRiPt:alert(1))',
      '[c](&#106;avascript:alert(1))',
      '[safe](https://ocobo.co)',
    ].join('\n\n');
    const result = process(withFrontmatter('title: T', body));
    const hrefs = collectTags(result.data?.content ?? null, 'Link').map(
      (tag) => tag.attributes.href,
    );

    expect(hrefs).toEqual(['https://ocobo.co']);
  });

  it('drops attributes a tag does not declare (event handlers)', () => {
    const body = '{% youtubePlayer id="abc" onload="alert(1)" /%}';
    const result = process(withFrontmatter('title: T', body));
    const [player] = collectTags(result.data?.content ?? null, 'PlayerYoutube');

    expect(player.attributes).toEqual({ id: 'abc' });
  });

  it('renders a custom tag missing a required attribute, without it', () => {
    const result = process(withFrontmatter('title: T', '{% youtubePlayer /%}'));
    const [player] = collectTags(result.data?.content ?? null, 'PlayerYoutube');

    expect(result.success).toBe(true);
    expect(player.attributes).toEqual({});
  });

  // Bug: the pipeline never calls Markdoc.validate, so `required: true` in
  // config.ts is not enforced. `{% youtubePlayer /%}` renders an embed of
  // https://www.youtube.com/embed/undefined instead of failing. A fix must
  // reject only errors of type `tag`: the document node declares
  // `frontmatter` as Object while Markdoc passes a string, so validate flags
  // every file. Flip to `it` (and drop the test above) once fixed.
  it.fails('rejects a custom tag missing a required attribute', () => {
    const result = process(withFrontmatter('title: T', '{% youtubePlayer /%}'));

    expect(result.success).toBe(false);
  });
});

describe('normalizeSlug', () => {
  it.each([
    ['post.md', 'post'],
    ['post', 'post'],
    ['index.md', ''],
    ['index', ''],
  ])('normalises %j to %j', (slug, expected) => {
    expect(normalizeSlug(slug)).toBe(expected);
  });

  // Bug: `.replace('index', '')` removes the first "index" anywhere in the
  // slug, so a post named "reindex-guide.md" gets the slug "re-guide".
  // `.replace('.md', '')` has the same first-match-anywhere behaviour.
  // Flip to `it` once only a whole "index" file name is stripped.
  it.fails('keeps "index" inside a longer slug', () => {
    expect(normalizeSlug('reindex-guide.md')).toBe('reindex-guide');
  });
});

describe('constructFilePath', () => {
  it.each([
    ['', 'content/blog/index.md'],
    ['index', 'content/blog/index.md'],
    ['my-post', 'content/blog/my-post.md'],
  ])('maps slug %j to %j', (slug, expected) => {
    expect(constructFilePath('content/blog', slug)).toBe(expected);
  });
});

describe('mapStatusToState', () => {
  it.each([
    [200, 'success'],
    [404, 'not_found'],
    [403, 'source_error'],
    [500, 'source_error'],
  ] as const)('maps %i to %s', (status, expected) => {
    expect(mapStatusToState(status)).toBe(expected);
  });
});

describe('createValidator', () => {
  it('exposes the schema and type name, and type-guards with the schema', () => {
    expect(thingValidator.typeName).toBe('Thing');
    expect(thingValidator.schema).toBe(ThingSchema);
    expect(thingValidator.isValid({ title: 'T' })).toBe(true);
    expect(thingValidator.isValid({ title: 1 })).toBe(false);
  });
});
