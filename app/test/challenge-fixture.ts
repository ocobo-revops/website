import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';

import {
  type ChallengeFrontmatter,
  ChallengeFrontmatterSchema,
} from '~/modules/challenge-schema';
import type { MarkdocFile } from '~/types';

const FIXTURES_DIR = join(__dirname, 'fixtures/content/challenges');

/**
 * A challenge fixture, parsed like the content pipeline does
 * (`content/processor.ts`) and validated against the schema.
 */
export function loadChallengeFixture(
  lang: string,
  slug: string,
): MarkdocFile<ChallengeFrontmatter> {
  const markdown = readFileSync(join(FIXTURES_DIR, lang, `${slug}.md`), 'utf8');
  const { frontmatter } = Markdoc.parse(markdown).attributes;
  return {
    slug,
    content: null,
    markdown,
    frontmatter: ChallengeFrontmatterSchema.parse(
      yaml.load(frontmatter, { schema: yaml.CORE_SCHEMA }),
    ),
  };
}
