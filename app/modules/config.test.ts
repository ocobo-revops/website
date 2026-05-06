import Markdoc from '@markdoc/markdoc';
import { describe, expect, it } from 'vitest';

import { createMarkdocConfig } from './config';

const NBSP = ' ';
const SAMPLE = 'Bonjour ! «ça farte ?» Note : test';

function renderToText(markdown: string, locale: string): string {
  const ast = Markdoc.parse(markdown);
  const transformed = Markdoc.transform(ast, createMarkdocConfig(locale));
  return JSON.stringify(transformed);
}

describe('createMarkdocConfig', () => {
  it('applies French typography to text nodes when locale is fr', () => {
    const out = renderToText(SAMPLE, 'fr');
    expect(out).toContain(`Bonjour${NBSP}!`);
    expect(out).toContain(`farte${NBSP}?`);
    expect(out).toContain(`Note${NBSP}:`);
  });

  it('leaves text nodes untouched for non-French locales', () => {
    const out = renderToText(SAMPLE, 'en');
    expect(out).toContain('Bonjour !');
    expect(out).toContain('Note :');
    expect(out).not.toContain(NBSP);
  });
});
