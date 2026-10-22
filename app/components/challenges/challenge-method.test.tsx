/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { ChallengeMethod as ChallengeMethodData } from '~/modules/challenge-page';
import type { Tool } from '~/modules/content/tools';
import { render, screen, within } from '~/test/utils';

import { ChallengeMethod } from './challenge-method';

const method: ChallengeMethodData = {
  title: null,
  subtitle: null,
  steps: [
    { title: null, text: 'We map the pipeline.' },
    { title: null, text: 'We build the model.' },
    { title: null, text: 'Your team runs it.' },
  ],
  tools: ['hubspot', 'clari'],
  note: null,
};

const tools: Tool[] = [
  {
    slug: 'hubspot',
    name: 'HubSpot',
    iconUrl: 'https://example.com/hubspot.svg',
  },
  { slug: 'clari', name: 'Clari' },
];

describe('ChallengeMethod', () => {
  it('lists the tools, as a logo or as a name', () => {
    render(<ChallengeMethod method={method} challenge="rp" tools={tools} />, {
      i18nLang: 'en',
    });

    expect(screen.getByText('The tools we deploy most')).toBeInTheDocument();
    const lists = screen.getAllByRole('list');
    const toolList = lists[lists.length - 1];
    expect(
      within(toolList).getByRole('img', { name: 'HubSpot' }),
    ).toHaveAttribute('src', 'https://example.com/hubspot.svg');
    expect(within(toolList).getByText('Clari')).toBeInTheDocument();
  });

  it('drops the tools card without tools or note', () => {
    render(<ChallengeMethod method={method} challenge="rp" tools={[]} />, {
      i18nLang: 'en',
    });

    expect(
      screen.queryByText('The tools we deploy most'),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });
});
