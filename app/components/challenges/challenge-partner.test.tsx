/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { ChallengePartner as ChallengePartnerData } from '~/modules/content/challenge-references';
import { axe, render, screen } from '~/test/utils';

import { ChallengePartner } from './challenge-partner';

const partner: ChallengePartnerData = {
  tool: {
    slug: 'qobra',
    name: 'Qobra',
    iconUrl: 'https://example.com/qobra.svg',
  },
  sentence: 'Commissions computed on their own.',
  metrics: [
    { before: '7 days', after: '1', label: 'to close the commissions' },
    { before: '3 days', after: '½', label: 'of disputes each month' },
  ],
  source: 'Figures published by Qobra about its customers.',
};

describe('ChallengePartner', () => {
  it('shows the partner, its metrics and their source', () => {
    render(<ChallengePartner partner={partner} />, { i18nLang: 'en' });

    expect(screen.getByRole('img', { name: 'Qobra' })).toBeInTheDocument();
    expect(
      screen.getByText('Commissions computed on their own.'),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('to close the commissions')).toBeInTheDocument();
    expect(
      screen.getByText('Figures published by Qobra about its customers.'),
    ).toBeInTheDocument();
  });

  it('keeps the source without metrics or logo', () => {
    render(
      <ChallengePartner
        partner={{
          ...partner,
          tool: { slug: 'qobra', name: 'Qobra' },
          metrics: [],
        }}
      />,
      { i18nLang: 'fr' },
    );

    expect(screen.getByText('Qobra')).toBeInTheDocument();
    expect(screen.getByText('Avec')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.getByText('Figures published by Qobra about its customers.'),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChallengePartner partner={partner} />, {
      i18nLang: 'en',
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
