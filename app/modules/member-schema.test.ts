// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';
import { describe, expect, it } from 'vitest';

import { CHALLENGE_KEYS } from './challenge-schema';
import { MemberFrontmatterSchema } from './schemas';

// Base fields are also covered in `schemas.test.ts`; this file covers the
// posts files and the expert fields of ocobo-revops/posts#95.
//
// Copies of every `team/*.md` file of ocobo-revops/posts (main b34a449). None
// sets an expert field yet. Refresh them when the posts Team member schema
// changes or when expert fields arrive in `team/*.md`.
const FIXTURES_DIR = join(__dirname, '../test/fixtures/content/team');

// Same frontmatter parsing as the content pipeline (`content/processor.ts`).
const loadFixture = (file: string): Record<string, any> => {
  const markdown = readFileSync(join(FIXTURES_DIR, file), 'utf8');
  const { frontmatter } = Markdoc.parse(markdown).attributes;
  return yaml.load(frontmatter, { schema: yaml.CORE_SCHEMA }) as Record<
    string,
    any
  >;
};

const messagesOf = (data: unknown) => {
  const result = MemberFrontmatterSchema.safeParse(data);
  return result.success ? [] : result.error.issues.map((i) => i.message);
};

const accepts = (data: unknown) =>
  MemberFrontmatterSchema.safeParse(data).success;

describe('Team member fixtures', () => {
  const files = readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.md'));

  it('has the posts team files', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)('validates %s', (file) => {
    expect(messagesOf(loadFixture(file))).toEqual([]);
  });
});

describe('Team member expert fields', () => {
  const base = loadFixture('benjamin-boileux.md');
  const expert = {
    ...base,
    challenge: 'sc',
    contribution: { fr: 'Contribution', en: 'Contribution EN' },
    tools: ['hubspot', 'qobra'],
    previousCompanies: ['Qonto'],
  };

  it('accepts a member with all four expert fields', () => {
    const result = MemberFrontmatterSchema.safeParse(expert);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject({
        challenge: 'sc',
        contribution: expert.contribution,
        tools: ['hubspot', 'qobra'],
        previousCompanies: ['Qonto'],
      });
    }
  });

  it.each(CHALLENGE_KEYS)('accepts the challenge key %s', (challenge) => {
    expect(accepts({ ...expert, challenge })).toBe(true);
  });

  it('rejects an unknown challenge key', () => {
    expect(accepts({ ...expert, challenge: 'xx' })).toBe(false);
  });

  it.each(['contribution', 'tools'] as const)(
    'rejects challenge without %s',
    (field) => {
      const { [field]: _omitted, ...rest } = expert;
      const result = MemberFrontmatterSchema.safeParse(rest);
      expect(result.success).toBe(false);
      expect(
        result.error?.issues.map(({ path, message }) => ({ path, message })),
      ).toEqual([
        {
          path: [field],
          message: `${field} is required when challenge is set`,
        },
      ]);
    },
  );

  it('accepts challenge without previousCompanies', () => {
    const { previousCompanies: _omitted, ...rest } = expert;
    expect(accepts(rest)).toBe(true);
  });

  it('accepts contribution, tools and previousCompanies without challenge', () => {
    const { challenge: _omitted, ...rest } = expert;
    expect(accepts(rest)).toBe(true);
  });

  it('caps contribution at 100 characters per language', () => {
    const ok = 'x'.repeat(100);
    const tooLong = 'x'.repeat(101);
    expect(accepts({ ...expert, contribution: { fr: ok, en: ok } })).toBe(true);
    expect(accepts({ ...expert, contribution: { fr: tooLong, en: ok } })).toBe(
      false,
    );
    expect(accepts({ ...expert, contribution: { fr: ok, en: tooLong } })).toBe(
      false,
    );
  });

  it('applies the contribution cap to the raw text', () => {
    const contribution = { fr: `${'x'.repeat(100)} `, en: 'ok' };
    expect(accepts({ ...expert, contribution })).toBe(false);
  });

  it('rejects a contribution missing a language', () => {
    expect(accepts({ ...expert, contribution: { fr: 'Contribution' } })).toBe(
      false,
    );
  });

  it('accepts 1 to 8 tools and rejects 0 or 9', () => {
    const slugs = (n: number) => Array.from({ length: n }, (_, i) => `t-${i}`);
    expect(accepts({ ...expert, tools: slugs(1) })).toBe(true);
    expect(accepts({ ...expert, tools: slugs(8) })).toBe(true);
    expect(accepts({ ...expert, tools: [] })).toBe(false);
    expect(accepts({ ...expert, tools: slugs(9) })).toBe(false);
  });

  it('keeps the tools order', () => {
    const tools = ['qobra', 'hubspot', 'notion'];
    const result = MemberFrontmatterSchema.safeParse({ ...expert, tools });
    expect(result.success && result.data.tools).toEqual(tools);
  });

  it('rejects duplicate tools', () => {
    expect(messagesOf({ ...expert, tools: ['hubspot', 'hubspot'] })).toContain(
      'tools must not contain duplicates',
    );
  });

  it('rejects a blank contribution or previous company', () => {
    const contribution = { fr: '   ', en: 'Contribution' };
    expect(accepts({ ...expert, contribution })).toBe(false);
    expect(accepts({ ...expert, previousCompanies: ['  '] })).toBe(false);
  });

  it('accepts 1 to 3 previous companies and rejects 0 or 4', () => {
    const four = ['A', 'B', 'C', 'D'];
    expect(accepts({ ...expert, previousCompanies: ['A', 'B', 'C'] })).toBe(
      true,
    );
    expect(accepts({ ...expert, previousCompanies: [] })).toBe(false);
    expect(accepts({ ...expert, previousCompanies: four })).toBe(false);
  });

  it('caps a previous company name at 30 characters', () => {
    const name = (n: number) => 'x'.repeat(n);
    expect(accepts({ ...expert, previousCompanies: [name(30)] })).toBe(true);
    expect(accepts({ ...expert, previousCompanies: [name(31)] })).toBe(false);
  });

  it('drops a quote key: bio stays the only about-us text', () => {
    const result = MemberFrontmatterSchema.safeParse({
      ...expert,
      quote: 'Ignored',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('quote');
      expect(result.data.bio).toEqual(base.bio);
    }
  });
});
