import { describe, expect, it } from 'vitest';

import type { Tool } from '~/modules/content';

import { prepareToolEntries } from './story-metas';

const makeTool = (slug: string, name: string): Tool => ({
  slug,
  name,
  category: undefined,
  iconUrl: undefined,
  url: undefined,
});

describe('prepareToolEntries', () => {
  it('returns resolved tool name and slug when resolvedTools is populated', () => {
    const tools = [
      makeTool('hubspot', 'HubSpot'),
      makeTool('notion', 'Notion'),
    ];
    const result = prepareToolEntries(tools, ['hubspot', 'notion']);
    expect(result).toEqual([
      { key: 'hubspot', label: 'HubSpot' },
      { key: 'notion', label: 'Notion' },
    ]);
  });

  it('falls back to raw slugs when resolvedTools is empty', () => {
    const result = prepareToolEntries([], ['hubspot', 'notion']);
    expect(result).toEqual([
      { key: 'hubspot', label: 'hubspot' },
      { key: 'notion', label: 'notion' },
    ]);
  });

  it('falls back to raw slugs when resolvedTools is undefined', () => {
    const result = prepareToolEntries(undefined, ['hubspot', 'notion']);
    expect(result).toEqual([
      { key: 'hubspot', label: 'hubspot' },
      { key: 'notion', label: 'notion' },
    ]);
  });
});
