// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { STAGE_IDS } from './bowtie-stages';
import { CHALLENGE_KEYS, ChallengeFrontmatterSchema } from './challenge-schema';

// Copies of the golden fixtures of ocobo-revops/posts#94
// (`scripts/__tests__/fixtures/challenges/`). Refresh them when the posts
// schema changes.
const FIXTURES_DIR = join(__dirname, '../test/fixtures/content/challenges/fr');

// Same frontmatter parsing as the content pipeline (`content/processor.ts`).
const loadFixture = (file: string): Record<string, any> => {
  const markdown = readFileSync(join(FIXTURES_DIR, file), 'utf8');
  const { frontmatter } = Markdoc.parse(markdown).attributes;
  return yaml.load(frontmatter, { schema: yaml.CORE_SCHEMA }) as Record<
    string,
    any
  >;
};

type Path = (string | number)[];

const parentOf = (data: Record<string, any>, path: Path) =>
  path.slice(0, -1).reduce((node, key) => node[key], data);

const withValue = (data: Record<string, any>, path: Path, value: unknown) => {
  const copy = structuredClone(data);
  parentOf(copy, path)[path[path.length - 1]] = value;
  return copy;
};

const without = (data: Record<string, any>, path: Path) => {
  const copy = structuredClone(data);
  delete parentOf(copy, path)[path[path.length - 1]];
  return copy;
};

const issuesOf = (data: unknown) => {
  const result = ChallengeFrontmatterSchema.safeParse(data);
  return result.success
    ? []
    : result.error.issues.map(({ path, message }) => ({ path, message }));
};

// Revenue AI sets every heading override. Adding a Story and workstream
// steps gives a file with every optional field set.
const complete = (() => {
  const data = loadFixture('revenue-ai.md');
  data.case.story = 'acme';
  data.workstreams.items = data.workstreams.items.map(
    (item: Record<string, unknown>, index: number) => ({
      ...item,
      step: index + 1,
    }),
  );
  return data;
})();

describe('challenge golden fixtures', () => {
  const files = readdirSync(FIXTURES_DIR).filter((file) =>
    file.endsWith('.md'),
  );

  it('has one fixture per challenge key', () => {
    expect(files.map((file) => loadFixture(file).key).sort()).toEqual(
      [...CHALLENGE_KEYS].sort(),
    );
  });

  // The slug is the English kebab-case of the name, the same in both languages.
  it.each(files)('%s is named after its challenge', (file) => {
    expect(file).toBe(
      `${loadFixture(file).name.toLowerCase().replaceAll(' ', '-')}.md`,
    );
  });

  it.each(files)('%s validates', (file) => {
    expect(issuesOf(loadFixture(file))).toEqual([]);
  });
});

describe('challenge optional fields', () => {
  it('accepts a file with every optional field set', () => {
    expect(issuesOf(complete)).toEqual([]);
  });

  it.each<[string, Path]>([
    ['workstreams.title', ['workstreams', 'title']],
    ['workstream step', ['workstreams', 'items', 0, 'step']],
    ['workstream note', ['workstreams', 'items', 0, 'note']],
    ['method.title', ['method', 'title']],
    ['method step title', ['method', 'steps', 0, 'title']],
    ['case.story', ['case', 'story']],
  ])('accepts a file without %s', (_, path) => {
    expect(issuesOf(without(complete, path))).toEqual([]);
  });

  it('accepts a method without tools', () => {
    expect(issuesOf(withValue(complete, ['method', 'tools'], []))).toEqual([]);
  });

  it.each([
    'hero',
    'bowtie',
    'symptoms',
    'audience',
    'workstreams',
    'aiBridge',
    'method',
    'case',
    'diagnostic',
  ])('rejects a file without %s', (section) => {
    expect(issuesOf(without(complete, [section]))).not.toEqual([]);
  });
});

describe('challenge bowtie.activeStages', () => {
  it('accepts every Stage id', () => {
    expect(
      issuesOf(withValue(complete, ['bowtie', 'activeStages'], [...STAGE_IDS])),
    ).toEqual([]);
  });

  it('rejects an unknown Stage id', () => {
    const issues = issuesOf(
      withValue(complete, ['bowtie', 'activeStages'], ['discovery', 'renewal']),
    );
    expect(issues.map(({ path }) => path)).toEqual([
      ['bowtie', 'activeStages', 1],
    ]);
  });

  it('rejects a duplicate Stage id', () => {
    expect(
      issuesOf(
        withValue(
          complete,
          ['bowtie', 'activeStages'],
          ['discovery', 'discovery'],
        ),
      ),
    ).toEqual([
      { path: ['bowtie', 'activeStages'], message: 'Stage ids must be unique' },
    ]);
  });

  it('rejects no Stage', () => {
    expect(
      issuesOf(withValue(complete, ['bowtie', 'activeStages'], [])),
    ).not.toEqual([]);
  });
});

describe('challenge key and caps', () => {
  it('rejects an unknown key', () => {
    expect(issuesOf(withValue(complete, ['key'], 'xx'))).not.toEqual([]);
  });

  it('states the overage of a text over its cap', () => {
    expect(issuesOf(withValue(complete, ['name'], 'x'.repeat(35)))).toEqual([
      { path: ['name'], message: '35 characters, cap 30 (5 over)' },
    ]);
  });

  it('measures the length after trimming', () => {
    expect(
      issuesOf(withValue(complete, ['name'], ` ${'x'.repeat(30)} `)),
    ).toEqual([]);
  });

  it('rejects an empty text', () => {
    expect(issuesOf(withValue(complete, ['tagline'], '  '))).toEqual([
      { path: ['tagline'], message: 'must not be empty' },
    ]);
  });
});

describe('challenge unknown keys', () => {
  it('rejects extraSections', () => {
    expect(issuesOf(withValue(complete, ['extraSections'], []))).toEqual([
      expect.objectContaining({ path: [] }),
    ]);
  });

  // Both come in #230, with the matching posts schema change. The test checks
  // the key is unknown, so it fails as soon as the schema knows it.
  it.each<[string, Path]>([
    ['partner', ['partner']],
    ['aiBridge.demo', ['aiBridge', 'demo']],
  ])('rejects %s as an unknown key until #230', (key, path) => {
    const result = ChallengeFrontmatterSchema.safeParse(
      withValue(complete, path, {}),
    );
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        code: 'unrecognized_keys',
        path: path.slice(0, -1),
        keys: [key.split('.').pop()],
      }),
    ]);
  });

  it('rejects an unknown key in a nested object', () => {
    expect(
      issuesOf(withValue(complete, ['hero', 'subtitle'], 'Extra')),
    ).toEqual([expect.objectContaining({ path: ['hero'] })]);
  });
});
