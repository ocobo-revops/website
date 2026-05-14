import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '~/test/utils';

import { Navbar } from './navbar';

describe('Navbar', () => {
  it('renders the navigation element and top-level items', () => {
    render(<Navbar />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Notre Offre' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Success Stories' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /méthode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /à propos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ressources/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('nav-cta')).toBeInTheDocument();
  });

  it('mobile hamburger opens the navigation drawer', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(
      await screen.findByRole('dialog', { name: 'Navigation menu' }),
    ).toBeInTheDocument();
  });

  it('close button dismisses the mobile drawer', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await screen.findByRole('dialog', { name: 'Navigation menu' });

    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(
      screen.queryByRole('dialog', { name: 'Navigation menu' }),
    ).not.toBeInTheDocument();
  });

  it('current route link gets aria-current="page"', () => {
    render(<Navbar />, { initialEntries: ['/fr/offer'] });

    expect(screen.getByRole('link', { name: 'Notre Offre' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('link', { name: 'Success Stories' }),
    ).not.toHaveAttribute('aria-current');
  });
});
