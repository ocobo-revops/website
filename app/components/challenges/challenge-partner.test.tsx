/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { ChallengePartner as ChallengePartnerData } from '~/modules/content/challenge-references';
import { axe, fireEvent, render, screen } from '~/test/utils';

import { ChallengePartner } from './challenge-partner';

const source = 'Figures published by Qobra about its customers.';

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
  source,
};

describe('ChallengePartner', () => {
  it('shows the source with the metrics it attributes', () => {
    render(<ChallengePartner partner={partner} />, { i18nLang: 'en' });

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText(source)).toBeInTheDocument();
  });

  it('drops the source when no metric is left', () => {
    render(<ChallengePartner partner={{ ...partner, metrics: [] }} />, {
      i18nLang: 'en',
    });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText(source)).not.toBeInTheDocument();
    expect(
      screen.getByText('Commissions computed on their own.'),
    ).toBeInTheDocument();
  });

  it('names the partner when it has no logo', () => {
    render(
      <ChallengePartner
        partner={{ ...partner, tool: { slug: 'qobra', name: 'Qobra' } }}
      />,
      { i18nLang: 'en' },
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Qobra')).toBeInTheDocument();
  });

  it('names the partner when its logo fails to load', () => {
    render(<ChallengePartner partner={partner} />, { i18nLang: 'en' });

    fireEvent.error(screen.getByRole('img', { name: 'Qobra' }));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Qobra')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChallengePartner partner={partner} />, {
      i18nLang: 'en',
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
