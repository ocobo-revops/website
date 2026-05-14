import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, userEvent, waitFor } from '~/test/utils';

import { Navbar } from './navbar';

// MobileMenu reads window.matchMedia to close on lg breakpoint — JSDOM omits this API
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('Navbar', () => {
  it('renders the navigation element and top-level items', () => {
    render(<Navbar />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();

    // Direct-link items
    expect(
      screen.getByRole('link', { name: 'Notre Offre' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Success Stories' }),
    ).toBeInTheDocument();

    // Dropdown trigger buttons
    expect(
      screen.getByRole('button', { name: /méthode/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /à propos/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ressources/i }),
    ).toBeInTheDocument();
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

  it('Escape key dismisses the mobile drawer', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Navigation menu',
    });

    // Ark UI Dialog processes Escape on the focused content element (tabindex="-1")
    dialog.focus();
    fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape', keyCode: 27 });

    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Navigation menu' }),
      ).not.toBeInTheDocument();
    });
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
