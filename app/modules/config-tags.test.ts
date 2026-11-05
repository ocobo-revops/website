// @vitest-environment node

import Markdoc, { type RenderableTreeNode, Tag } from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';

import { config, createMarkdocConfig } from './config';

const NBSP = String.fromCharCode(0xa0);

function transform(markdown: string, markdocConfig = config): Tag {
  const tree = Markdoc.transform(Markdoc.parse(markdown), markdocConfig);
  if (!Tag.isTag(tree)) throw new Error('Expected a Tag at the root');
  return tree;
}

function findTag(node: RenderableTreeNode, name: string): Tag | undefined {
  if (!Tag.isTag(node)) return undefined;
  if (node.name === name) return node;
  for (const child of node.children) {
    const found = findTag(child, name);
    if (found) return found;
  }
  return undefined;
}

function tagErrors(markdown: string): string[] {
  return Markdoc.validate(Markdoc.parse(markdown), config)
    .filter((e) => e.type === 'tag')
    .map((e) => e.error.id);
}

describe('Markdoc config: custom tags', () => {
  it.each([
    [
      'tweet',
      '{% tweet url="https://x.com/ocobo/status/1" /%}',
      'TweetEmbed',
      { url: 'https://x.com/ocobo/status/1' },
    ],
    [
      'statement',
      '{% statement %}\nBold claim.\n{% /statement %}',
      'Statement',
      {},
    ],
    [
      'callout',
      '{% callout title="Note" %}\nRead this.\n{% /callout %}',
      'Callout',
      { title: 'Note' },
    ],
    [
      'aushaPlayer',
      '{% aushaPlayer podcastId="p1" showId="s1" title="Ep 1" /%}',
      'AushaPlayer',
      { podcastId: 'p1', showId: 's1', title: 'Ep 1' },
    ],
    [
      'hubspotForm',
      '{% hubspotForm formId="f-123" /%}',
      'HubspotForm',
      { formId: 'f-123' },
    ],
    [
      'youtubePlayer',
      '{% youtubePlayer id="dQw4w9WgXcQ" title="Talk" /%}',
      'PlayerYoutube',
      { id: 'dQw4w9WgXcQ', title: 'Talk' },
    ],
  ])('%s renders %s with its attributes', (_tag, markdown, render, attrs) => {
    const found = findTag(transform(markdown), render);

    expect(tagErrors(markdown)).toEqual([]);
    expect(found?.attributes).toEqual(attrs);
  });

  it('keeps the children of block tags', () => {
    const callout = findTag(
      transform('{% callout %}\nRead this.\n{% /callout %}'),
      'Callout',
    );
    const paragraph = findTag(callout ?? null, 'Paragraph');

    expect(paragraph?.children).toEqual(['Read this.']);
  });

  it.each([
    ['tweet', '{% tweet /%}'],
    ['aushaPlayer', '{% aushaPlayer showId="s1" /%}'],
    ['hubspotForm', '{% hubspotForm /%}'],
    ['youtubePlayer', '{% youtubePlayer title="x" /%}'],
  ])('%s declares its id attribute as required', (_tag, markdown) => {
    expect(tagErrors(markdown)).toEqual(['attribute-missing-required']);
  });

  it('drops an undeclared attribute and reports it on validation', () => {
    const markdown = '{% hubspotForm formId="f" onClick="alert(1)" /%}';

    expect(findTag(transform(markdown), 'HubspotForm')?.attributes).toEqual({
      formId: 'f',
    });
    expect(tagErrors(markdown)).toEqual(['attribute-undefined']);
  });

  it('renders only the children of an unknown tag', () => {
    const markdown =
      '{% iframe src="https://evil.test" %}\nText\n{% /iframe %}';
    const tree = transform(markdown);

    expect(tree.children).toHaveLength(1);
    const [only] = tree.children;
    expect(Tag.isTag(only) && only.name).toBe('Paragraph');
    expect(findTag(tree, 'Paragraph')?.children).toEqual(['Text']);
    expect(tagErrors(markdown)).toEqual(['tag-undefined']);
  });
});

describe('Markdoc config: custom nodes', () => {
  it('slugifies heading text into an id, accents included', () => {
    const heading = findTag(transform('## Évolution des méthodes'), 'Heading');

    expect(heading?.attributes).toEqual({
      id: 'evolution-des-methodes',
      level: 2,
    });
  });

  it('keeps an explicit heading id', () => {
    const heading = findTag(transform('### Titre {% #mon-ancre %}'), 'Heading');

    expect(heading?.attributes).toEqual({ id: 'mon-ancre', level: 3 });
  });

  it('builds the heading id from nested inline text', () => {
    const heading = findTag(transform('## Le **RevOps** en *2025*'), 'Heading');

    expect(heading?.attributes.id).toBe('le-revops-en-2025');
  });

  it('maps standard nodes to the site components', () => {
    const tree = transform(
      [
        '> Quote',
        '',
        '1. one',
        '',
        '[link](https://ocobo.co "Ocobo")',
        '',
        '```ts',
        'const a = 1;',
        '```',
      ].join('\n'),
    );

    expect(findTag(tree, 'Quote')).toBeDefined();
    expect(findTag(tree, 'List')?.attributes.ordered).toBe(true);
    expect(findTag(tree, 'ListItem')?.children).toEqual(['one']);
    expect(findTag(tree, 'Link')?.attributes).toEqual({
      href: 'https://ocobo.co',
      title: 'Ocobo',
    });
    expect(findTag(tree, 'CodeBlock')?.attributes).toEqual({
      language: 'ts',
      content: 'const a = 1;\n',
    });
  });

  it('defaults table cell colour and flags values outside the list on validation', () => {
    const markdown = [
      '{% table %}',
      '* A',
      '* B',
      '---',
      '* plain',
      '* red {% color="red" %}',
      '{% /table %}',
    ].join('\n');
    const tree = transform(markdown);
    const cells = findTag(tree, 'tbody')?.children.flatMap((row) =>
      Tag.isTag(row) ? row.children : [],
    );

    expect(findTag(tree, 'TH')?.children).toEqual(['A']);
    expect(cells?.map((c) => Tag.isTag(c) && c.attributes.color)).toEqual([
      'default',
      'red',
    ]);
    const invalid = markdown.replace('color="red"', 'color="purple"');
    expect(
      Markdoc.validate(Markdoc.parse(invalid), config).map((e) => e.error.id),
    ).toContain('attribute-value-invalid');
  });
});

describe('createMarkdocConfig', () => {
  it('returns the base config unchanged for non-French locales', () => {
    expect(createMarkdocConfig('en')).toBe(config);
  });

  it('keeps every custom tag in the French config', () => {
    expect(Object.keys(createMarkdocConfig('fr').tags ?? {})).toEqual(
      Object.keys(config.tags ?? {}),
    );
  });

  it('does not apply French typography inside code fences', () => {
    const fr = createMarkdocConfig('fr');
    const tree = transform('Note : ok\n\n```txt\nNote : ok\n```', fr);

    expect(findTag(tree, 'Paragraph')?.children).toEqual([`Note${NBSP}: ok`]);
    expect(findTag(tree, 'CodeBlock')?.attributes.content).toBe('Note : ok\n');
  });

  it('does not apply French typography to tag attributes', () => {
    const fr = createMarkdocConfig('fr');
    const tree = transform(
      '{% callout title="Note : ok" %}\nx\n{% /callout %}',
      fr,
    );

    expect(findTag(tree, 'Callout')?.attributes.title).toBe('Note : ok');
  });
});
