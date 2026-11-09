/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { HomeChallengeCard } from '~/modules/home-challenges';
import { render, screen, userEvent } from '~/test/utils';

import { HomeChallengeCards } from './home-challenge-cards';

const challenge: HomeChallengeCard = {
  slug: 'sales-experience',
  key: 'se',
  order: 1,
  name: 'Sales Experience',
  tagline: 'Une organisation commerciale qui grandit avec vous',
  quote: "Deux commerciaux font l'essentiel du chiffre.",
  intro: 'Six chantiers, priorisés selon votre point de départ.',
  workstreams: ['Des leads mieux ciblés', 'Les bons rôles'],
};

const flipButton = () => screen.getByRole('button', { name: /Retourner/ });
const pageLink = () =>
  screen.queryByRole('link', { name: 'Voir les chantiers : Sales Experience' });

describe('HomeChallengeCards', () => {
  it('shows the file content, with no link on the front', () => {
    render(<HomeChallengeCards challenges={[challenge]} />);

    expect(screen.getByText('Enjeu 01')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: challenge.tagline ?? '' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Deux commerciaux/)).toBeInTheDocument();
    // The back is inert until the card turns: nothing on the front navigates.
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.queryByText(/Survolez/)).not.toBeInTheDocument();
  });

  it('shows the back on a tap on the front, without navigating', async () => {
    const user = userEvent.setup();
    render(<HomeChallengeCards challenges={[challenge]} />);

    await user.pointer({
      keys: '[TouchA]',
      target: screen.getByText(/Deux commerciaux/),
    });

    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Les bons rôles')).toBeInTheDocument();
    expect(pageLink()).toHaveAttribute(
      'href',
      '/fr/challenges/sales-experience',
    );
  });

  it('flips with the keyboard and reaches the link next', async () => {
    const user = userEvent.setup();
    render(<HomeChallengeCards challenges={[challenge]} />);

    await user.tab();
    expect(flipButton()).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');

    await user.tab();
    expect(pageLink()).toHaveFocus();
  });

  it('links to the English challenge page on English pages', async () => {
    const user = userEvent.setup();
    render(<HomeChallengeCards challenges={[challenge]} />, {
      i18nLang: 'en',
      initialEntries: ['/en'],
      path: ':lang/*',
    });

    await user.tab();
    await user.keyboard('{Enter}');

    expect(
      screen.getByRole('link', {
        name: 'See the workstreams: Sales Experience',
      }),
    ).toHaveAttribute('href', '/en/challenges/sales-experience');
  });
});
