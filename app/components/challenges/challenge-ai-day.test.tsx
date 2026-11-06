/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import { axe, render, screen } from '~/test/utils';

import { ChallengeAiDay } from './challenge-ai-day';

describe('ChallengeAiDay', () => {
  it('shows the first moment and its agent message', () => {
    render(<ChallengeAiDay />);

    expect(
      screen.getByRole('tablist', { name: 'Une journée type' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Cibler',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Northwind');
    expect(
      screen.getByRole('button', { name: 'Mettre en pause le défilement' }),
    ).toBeInTheDocument();
  });

  it('renders the English copy', () => {
    render(<ChallengeAiDay />, { i18nLang: 'en' });

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'A day in sales, with its agents.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
      'Target',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChallengeAiDay />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
