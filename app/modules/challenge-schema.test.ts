// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { STAGE_IDS } from './bowtie-stages';
import { CHALLENGE_KEYS, ChallengeFrontmatterSchema } from './challenge-schema';

// Copies of the golden fixtures of the posts repo
// (`scripts/__tests__/fixtures/challenges/`, after posts#96 and posts#97).
// Refresh them when the posts schema changes. Only Sales Compensation has a
// partner block, and Revenue AI has no agent window.
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

// Revenue AI sets every heading override. Adding a Story, workstream steps,
// the Sales Compensation partner block and the Revenue Performance agent
// window with a note gives a file with every optional field set.
const complete = (() => {
  const data = loadFixture('revenue-ai.md');
  data.case.story = 'acme';
  data.partner = loadFixture('sales-compensation.md').partner;
  data.aiBridge.demo = {
    ...loadFixture('revenue-performance.md').aiBridge.demo,
    note: 'Comptes et montants fictifs.',
  };
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

  it('the Revenue AI fixture has no agent window', () => {
    expect(loadFixture('revenue-ai.md').aiBridge.demo).toBeUndefined();
  });

  it.each(files.filter((file) => file !== 'revenue-ai.md'))(
    '%s carries an agent window of four elements',
    (file) => {
      expect(loadFixture(file).aiBridge.demo.elements).toHaveLength(4);
    },
  );

  it('only the Sales Compensation fixture has a partner block', () => {
    expect(files.filter((file) => loadFixture(file).partner)).toEqual([
      'sales-compensation.md',
    ]);
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
    ['partner', ['partner']],
    ['aiBridge.demo', ['aiBridge', 'demo']],
    ['aiBridge.demo.note', ['aiBridge', 'demo', 'note']],
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
  [['partner', 'sentence'], 140],
  [['partner', 'metrics', 0, 'before'], 12],
  [['partner', 'metrics', 0, 'after'], 12],
  [['partner', 'metrics', 0, 'label'], 90],
  [['partner', 'metrics', 1, 'before'], 12],
  [['partner', 'metrics', 1, 'after'], 12],
  [['partner', 'metrics', 1, 'label'], 90],
  [['partner', 'source'], 90],
  [['aiBridge', 'title'], 92],
  [['aiBridge', 'bullets', 0], 125],
  [['aiBridge', 'demo', 'channel'], 28],
  [['aiBridge', 'demo', 'agent'], 24],
  [['aiBridge', 'demo', 'opening', 'text'], 70],
  [['aiBridge', 'demo', 'footer'], 60],
  [['aiBridge', 'demo', 'note'], 90],
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
  [['partner', 'metrics'], 2, 2],
  [['aiBridge', 'bullets'], 3, 3],
  [['aiBridge', 'demo', 'elements'], 1, 4],
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

  it.each<[Path]>([
    [['hero', 'subtitle']],
    [['partner', 'logo']],
    [['partner', 'metrics', 0, 'trend']],
    [['aiBridge', 'demo', 'avatar']],
    [['aiBridge', 'demo', 'opening', 'emoji']],
  ])('rejects the unknown key %j', (path) => {
    expect(issuesOf(withValue(complete, path, 'x'))).toEqual([
      {
        path: path.slice(0, -1),
        message: `Unrecognized key: "${path[path.length - 1]}"`,
      },
    ]);
  });
});

describe('challenge partner block', () => {
  it.each([1, 3])('rejects %i metrics', (count) => {
    const metrics = Array.from({ length: count }, () =>
      structuredClone(complete.partner.metrics[0]),
    );
    expect(
      issuesOf(withValue(complete, ['partner', 'metrics'], metrics)),
    ).toEqual([{ path: ['partner', 'metrics'], message: expect.any(String) }]);
  });

  it.each<[Path]>([
    [['partner', 'tool']],
    [['partner', 'sentence']],
    [['partner', 'metrics']],
    [['partner', 'source']],
    [['partner', 'metrics', 1, 'after']],
  ])('rejects a missing %j', (path) => {
    expect(issuesOf(without(complete, path))).toEqual([
      { path, message: expect.any(String) },
    ]);
  });

  it('rejects a blank Tool slug', () => {
    expect(issuesOf(withValue(complete, ['partner', 'tool'], '   '))).toEqual([
      { path: ['partner', 'tool'], message: 'must not be empty' },
    ]);
  });
});

const DEMO: Path = ['aiBridge', 'demo'];
const ELEMENTS_PATH: Path = [...DEMO, 'elements'];

// One valid element of each type, from the mockup windows.
const ELEMENTS: Record<string, Record<string, any>> = {
  kpis: {
    type: 'kpis',
    items: [
      { value: '1,24 M€', label: 'commit' },
      { value: '82 %', label: "de l'objectif" },
      { value: '+6 pts', label: 'vs. S-1' },
    ],
  },
  figure: {
    type: 'figure',
    value: '3 840 €',
    caption: 'de commission si signé ce mois-ci',
  },
  progress: { type: 'progress', percent: 82, target: 100 },
  status: {
    type: 'status',
    label: 'Contrôle',
    value: '1 deal compté deux fois',
    state: 'alert',
  },
  buttons: { type: 'buttons', labels: ['Ouvrir le compte', 'Préparer le RDV'] },
};

const withElement = (element: Record<string, unknown>) =>
  withValue(complete, ELEMENTS_PATH, [element]);

const elementWith = (type: string, path: Path, value: unknown) =>
  withValue(ELEMENTS[type], path, value);

// Same table as the posts repo tests: [type, path in the element, cap].
const ELEMENT_CAPS: [string, Path, number][] = [
  ['kpis', ['items', 0, 'value'], 10],
  ['kpis', ['items', 2, 'label'], 16],
  ['figure', ['value'], 12],
  ['figure', ['caption'], 48],
  ['status', ['label'], 24],
  ['status', ['value'], 32],
  ['buttons', ['labels', 1], 20],
];

// Every required field of each element type.
const ELEMENT_FIELDS: [string, string][] = [
  ['kpis', 'items'],
  ['figure', 'value'],
  ['figure', 'caption'],
  ['progress', 'percent'],
  ['status', 'label'],
  ['status', 'value'],
  ['status', 'state'],
  ['buttons', 'labels'],
];

describe('challenge agent window', () => {
  it.each(Object.keys(ELEMENTS))('accepts a %s element', (type) => {
    expect(issuesOf(withElement(ELEMENTS[type]))).toEqual([]);
  });

  it('accepts four elements of mixed types', () => {
    const { figure, progress, status, buttons } = ELEMENTS;
    expect(
      issuesOf(
        withValue(complete, ELEMENTS_PATH, [figure, progress, status, buttons]),
      ),
    ).toEqual([]);
  });

  it('rejects a fifth element', () => {
    expect(
      issuesOf(withValue(complete, ELEMENTS_PATH, Object.values(ELEMENTS))),
    ).toEqual([{ path: ELEMENTS_PATH, message: expect.any(String) }]);
  });

  it('rejects an unknown element type', () => {
    expect(issuesOf(withElement({ type: 'chart', value: '12' }))).toEqual([
      { path: [...ELEMENTS_PATH, 0, 'type'], message: expect.any(String) },
    ]);
  });

  it('rejects an element without a type', () => {
    expect(issuesOf(withElement(without(ELEMENTS.figure, ['type'])))).toEqual([
      { path: [...ELEMENTS_PATH, 0, 'type'], message: expect.any(String) },
    ]);
  });

  it.each(ELEMENT_CAPS)('%s %j accepts %i characters', (type, path, cap) => {
    expect(
      issuesOf(withElement(elementWith(type, path, 'a'.repeat(cap)))),
    ).toEqual([]);
  });

  it.each(ELEMENT_CAPS)(
    '%s %j rejects one character over cap %i',
    (type, path, cap) => {
      expect(
        issuesOf(withElement(elementWith(type, path, 'a'.repeat(cap + 1)))),
      ).toEqual([
        {
          path: [...ELEMENTS_PATH, 0, ...path],
          message: `${cap + 1} characters, cap ${cap} (1 over)`,
        },
      ]);
    },
  );

  it.each(ELEMENT_FIELDS)('rejects a %s element without %s', (type, field) => {
    expect(issuesOf(withElement(without(ELEMENTS[type], [field])))).toEqual([
      { path: [...ELEMENTS_PATH, 0, field], message: expect.any(String) },
    ]);
  });

  it.each(Object.keys(ELEMENTS))(
    'rejects an unknown key in a %s element',
    (type) => {
      expect(issuesOf(withElement({ ...ELEMENTS[type], icon: 'x' }))).toEqual([
        { path: [...ELEMENTS_PATH, 0], message: 'Unrecognized key: "icon"' },
      ]);
    },
  );

  it('rejects an unknown key in a KPI', () => {
    expect(
      issuesOf(withElement(elementWith('kpis', ['items', 0, 'trend'], 'x'))),
    ).toEqual([
      {
        path: [...ELEMENTS_PATH, 0, 'items', 0],
        message: 'Unrecognized key: "trend"',
      },
    ]);
  });

  it.each([2, 4])('rejects %i KPIs', (count) => {
    const items = Array.from(
      { length: count },
      (_, index) => ELEMENTS.kpis.items[index % 3],
    );
    expect(issuesOf(withElement({ type: 'kpis', items }))).toEqual([
      { path: [...ELEMENTS_PATH, 0, 'items'], message: expect.any(String) },
    ]);
  });

  it.each([[[]], [['Un', 'Deux', 'Trois']]])(
    'rejects buttons with %j labels',
    (labels) => {
      expect(issuesOf(withElement({ type: 'buttons', labels }))).toEqual([
        { path: [...ELEMENTS_PATH, 0, 'labels'], message: expect.any(String) },
      ]);
    },
  );

  it('accepts a single button', () => {
    expect(
      issuesOf(withElement({ type: 'buttons', labels: ['Ouvrir le compte'] })),
    ).toEqual([]);
  });

  it('accepts a progress bar without a target', () => {
    expect(issuesOf(withElement({ type: 'progress', percent: 82 }))).toEqual(
      [],
    );
  });

  it.each<[string, number]>([
    ['percent', 0],
    ['percent', 100],
    ['target', 0],
    ['target', 100],
  ])('accepts progress %s %i', (field, value) => {
    expect(
      issuesOf(withElement(elementWith('progress', [field], value))),
    ).toEqual([]);
  });

  it.each<[string, unknown]>([
    ['percent', -1],
    ['percent', 101],
    ['percent', 82.5],
    ['percent', '82'],
    ['target', 101],
    ['target', 99.5],
  ])('rejects progress %s %j', (field, value) => {
    expect(
      issuesOf(withElement(elementWith('progress', [field], value))),
    ).toEqual([
      { path: [...ELEMENTS_PATH, 0, field], message: expect.any(String) },
    ]);
  });

  it.each(['ok', 'alert'])('accepts status state %s', (state) => {
    expect(
      issuesOf(withElement(elementWith('status', ['state'], state))),
    ).toEqual([]);
  });

  it('rejects an unknown status state', () => {
    expect(
      issuesOf(withElement(elementWith('status', ['state'], 'warning'))),
    ).toEqual([
      { path: [...ELEMENTS_PATH, 0, 'state'], message: expect.any(String) },
    ]);
  });

  it.each(['question', 'statement'])('accepts opening kind %s', (kind) => {
    expect(
      issuesOf(withValue(complete, [...DEMO, 'opening', 'kind'], kind)),
    ).toEqual([]);
  });

  it('rejects an unknown opening kind', () => {
    expect(
      issuesOf(withValue(complete, [...DEMO, 'opening', 'kind'], 'answer')),
    ).toEqual([
      { path: [...DEMO, 'opening', 'kind'], message: expect.any(String) },
    ]);
  });

  it.each(['00:00', '09:12', '23:59'])('accepts time %s', (time) => {
    expect(issuesOf(withValue(complete, [...DEMO, 'time'], time))).toEqual([]);
  });

  it.each(['24:00', '8:05', '08:60', '08h05', '08:05:00', ' 08:05'])(
    'rejects time %j',
    (time) => {
      expect(issuesOf(withValue(complete, [...DEMO, 'time'], time))).toEqual([
        { path: [...DEMO, 'time'], message: 'must be a 24-hour time, HH:MM' },
      ]);
    },
  );

  // The website parser (YAML 1.2 core schema) keeps an unquoted 14:32 as a
  // string, so the file passes here.
  it('accepts an unquoted time as the website parses it', () => {
    const { time } = yaml.load('time: 14:32', {
      schema: yaml.CORE_SCHEMA,
    }) as { time: unknown };
    expect(time).toBe('14:32');
    expect(issuesOf(withValue(complete, [...DEMO, 'time'], time))).toEqual([]);
  });

  // The posts repo parses YAML 1.1, which reads the same 14:32 as 872 and
  // rejects the file. Quote the time so both repos accept it.
  it('asks to quote a time read as a number', () => {
    expect(issuesOf(withValue(complete, [...DEMO, 'time'], 872))).toEqual([
      { path: [...DEMO, 'time'], message: 'quote the time, e.g. "14:32"' },
    ]);
  });

  it.each<[Path]>([
    [['channel']],
    [['agent']],
    [['time']],
    [['opening']],
    [['opening', 'kind']],
    [['opening', 'text']],
    [['elements']],
    [['footer']],
  ])('rejects a missing %j', (path) => {
    expect(issuesOf(without(complete, [...DEMO, ...path]))).toEqual([
      { path: [...DEMO, ...path], message: expect.any(String) },
    ]);
  });
});
