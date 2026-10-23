/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { ChallengeAgentDemo } from '~/modules/challenge-page';
import { axe, render, screen } from '~/test/utils';

import { AgentWindow } from './agent-window';

// One element of each type, past the schema's four-element cap on purpose.
const demo: ChallengeAgentDemo = {
  channel: '# leadership',
  agent: 'Forecast agent',
  time: '08:05',
  opening: { kind: 'question', text: 'Where is the quarter?' },
  elements: [
    {
      type: 'kpis',
      items: [
        { value: '€1.24M', label: 'commit' },
        { value: '82%', label: 'of target' },
        { value: '+6 pts', label: 'vs. W-1' },
      ],
    },
    { type: 'figure', value: '€3,840', caption: 'commission if signed' },
    { type: 'progress', percent: 82, target: 90 },
    { type: 'status', label: 'Base rate', value: '8%', state: 'ok' },
    {
      type: 'status',
      label: 'Check',
      value: 'Deal counted twice',
      state: 'alert',
    },
    { type: 'buttons', labels: ['Open the account', 'Prepare the call'] },
  ],
  footer: 'Computed on HubSpot this morning',
  note: null,
};

describe('AgentWindow', () => {
  it('renders the frame and one element of each type', () => {
    render(<AgentWindow demo={demo} />, { i18nLang: 'en' });

    expect(screen.getByText('# leadership')).toBeInTheDocument();
    expect(screen.getByText('Forecast agent')).toBeInTheDocument();
    expect(screen.getByText('08:05')).toBeInTheDocument();
    expect(screen.getByText('“Where is the quarter?”')).toBeInTheDocument();
    // kpis
    expect(screen.getByText('€1.24M')).toBeInTheDocument();
    expect(screen.getByText('vs. W-1')).toBeInTheDocument();
    // figure
    expect(screen.getByText('€3,840')).toBeInTheDocument();
    expect(screen.getByText('commission if signed')).toBeInTheDocument();
    // progress
    const progress = screen.getByRole('progressbar', { name: 'Progress' });
    expect(progress).toHaveAttribute('aria-valuenow', '82');
    expect(progress).toHaveAttribute('aria-valuetext', '82%, target 90%');
    // status, with its state in words
    expect(screen.getByText('Base rate')).toBeInTheDocument();
    expect(screen.getByText('(on track)')).toBeInTheDocument();
    expect(screen.getByText('(alert)')).toBeInTheDocument();
    // buttons: pictures of buttons, nothing to click
    expect(screen.getByText('Prepare the call')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.getByText('Computed on HubSpot this morning'),
    ).toBeInTheDocument();
  });

  it('renders a statement as plain text, without quotes', () => {
    render(
      <AgentWindow
        demo={{
          ...demo,
          opening: { kind: 'statement', text: 'Daily CRM check done.' },
        }}
      />,
      { i18nLang: 'en' },
    );

    expect(screen.getByText('Daily CRM check done.')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<AgentWindow demo={demo} />, {
      i18nLang: 'en',
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
