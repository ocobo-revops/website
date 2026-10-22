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
    'key',
    'order',
    'name',
    'tagline',
    'hero',
    'bowtie',
    'symptoms',
    'audience',
    'workstreams',
    'aiBridge',
    'method',
    'case',
    'diagnostic',
  ])('rejects a file without %s', (field) => {
    expect(issuesOf(without(complete, [field]))).toEqual([
      { path: [field], message: expect.any(String) },
    ]);
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

// Same table as the posts repo tests: a value at the cap passes, one
// character over fails.
const CAPS: [Path, number][] = [
  [['name'], 30],
  [['tagline'], 60],
  [['hero', 'title', 0], 34],
  [['hero', 'title', 1], 42],
  [['hero', 'quote'], 80],
  [['hero', 'lead'], 240],
  [['hero', 'highlight'], 110],
  [['hero', 'cta'], 48],
  [['bowtie', 'caption'], 140],
  [['symptoms', 'title', 0], 64],
  [['symptoms', 'title', 1], 44],
  [['symptoms', 'items', 0], 130],
  [['audience', 0, 'team'], 20],
  [['audience', 0, 'roles'], 30],
  [['audience', 0, 'benefit'], 100],
  [['workstreams', 'title'], 50],
  [['workstreams', 'intro'], 120],
  [['workstreams', 'items', 0, 'category'], 26],
  [['workstreams', 'items', 0, 'title'], 64],
  [['workstreams', 'items', 0, 'description'], 210],
  [['workstreams', 'items', 0, 'deliverable'], 170],
  [['workstreams', 'items', 0, 'note'], 100],
  [['aiBridge', 'title'], 92],
  [['aiBridge', 'bullets', 0], 125],
  [['method', 'title'], 30],
  [['method', 'subtitle'], 75],
  [['method', 'steps', 0, 'title'], 28],
  [['method', 'steps', 0, 'text'], 150],
  [['method', 'note'], 170],
  [['case', 'headline'], 120],
  [['case', 'summary'], 220],
  [['case', 'metrics', 0, 'value'], 12],
  [['case', 'metrics', 0, 'label'], 90],
  [['diagnostic', 'question'], 88],
  [['diagnostic', 'subtitle'], 125],
];

describe('challenge caps', () => {
  it.each(CAPS)('%j accepts %i characters', (path, cap) => {
    expect(issuesOf(withValue(complete, path, 'a'.repeat(cap)))).toEqual([]);
  });

  it.each(CAPS)('%j rejects one character over cap %i', (path, cap) => {
    expect(issuesOf(withValue(complete, path, 'a'.repeat(cap + 1)))).toEqual([
      { path, message: `${cap + 1} characters, cap ${cap} (1 over)` },
    ]);
  });
});

// Same table as the posts repo tests: [path, min, max].
const COUNTS: [Path, number, number][] = [
  [['hero', 'title'], 2, 2],
  [['symptoms', 'title'], 2, 2],
  [['symptoms', 'items'], 5, 6],
  [['audience'], 4, 4],
  [['workstreams', 'items'], 4, 6],
  [['aiBridge', 'bullets'], 3, 3],
  [['method', 'steps'], 3, 3],
  [['method', 'tools'], 0, 9],
  [['case', 'metrics'], 2, 2],
];

// A list of `count` items, cycling through the items of `complete`.
const resize = (path: Path, count: number) => {
  const items = path.reduce((node, key) => node[key], complete) as unknown[];
  return Array.from({ length: count }, (_, index) =>
    structuredClone(items[index % items.length]),
  );
};

describe('challenge array counts', () => {
  it.each(COUNTS)('%j accepts %i to %i items', (path, min, max) => {
    expect(issuesOf(withValue(complete, path, resize(path, min)))).toEqual([]);
    expect(issuesOf(withValue(complete, path, resize(path, max)))).toEqual([]);
  });

  it.each(COUNTS)(
    '%j rejects fewer than %i or more than %i items',
    (path, min, max) => {
      // One issue at or under the path: for a tuple with an item missing, Zod
      // 4.3 reports the missing index (`['hero', 'title', 1]`).
      const issuePaths = (count: number) => {
        const issues = issuesOf(withValue(complete, path, resize(path, count)));
        return issues.map((issue) => issue.path.slice(0, path.length));
      };
      if (min > 0) {
        expect(issuePaths(min - 1)).toEqual([path]);
      }
      expect(issuePaths(max + 1)).toEqual([path]);
    },
  );
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
