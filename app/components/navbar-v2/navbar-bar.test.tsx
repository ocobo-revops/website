import { Target } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import type { NavItem } from '~/components/navbar/types';
import { axe, render, screen, userEvent, waitFor, within } from '~/test/utils';

import { NavbarBar } from './navbar-bar';

function mainNav() {
  return screen.getAllByRole('navigation', {
    name: 'Navigation principale',
  })[0];
}

describe('NavbarBar', () => {
  it('renders the production menu and the CTA', () => {
    render(<NavbarBar scrolled={false} />);
    const nav = mainNav();

    expect(
      within(nav).getByRole('link', { name: 'Notre Offre' }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole('link', { name: 'Success Stories' }),
    ).toBeInTheDocument();
    for (const name of ['Méthode', 'À propos', 'Ressources']) {
      expect(within(nav).getByRole('button', { name })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    expect(screen.getByTestId('nav-cta')).toHaveTextContent('Prendre RDV');
    expect(
      within(nav).getByRole('link', { name: 'Ocobo, accueil' }),
    ).toHaveAttribute('href', '/fr');
  });

  it('opens a dropdown from the keyboard and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} />);
    const button = screen.getByRole('button', { name: 'Méthode' });

    button.focus();
    await user.keyboard('{Enter}');

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const panel = document.getElementById(
      button.getAttribute('aria-controls') ?? '',
    );
    expect(panel).not.toBeNull();
    expect(panel).toBeVisible();
    expect(
      within(panel as HTMLElement).getByRole('link', {
        name: /The Revenue Experience System/,
      }),
    ).toHaveAttribute('href', '/fr/method');

    await user.tab();
    expect(panel).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(panel).not.toBeVisible();
    expect(button).toHaveFocus();
  });

  it('keeps one dropdown open at a time', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} />);
    const method = screen.getByRole('button', { name: 'Méthode' });
    const company = screen.getByRole('button', { name: 'À propos' });

    await user.click(method);
    await user.click(company);

    expect(method).toHaveAttribute('aria-expanded', 'false');
    expect(company).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes a dropdown on a click outside it', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} />);
    const method = screen.getByRole('button', { name: 'Méthode' });

    await user.click(method);
    await user.click(document.body);

    expect(method).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes a dropdown when focus leaves it', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} />);
    const method = screen.getByRole('button', { name: 'Méthode' });

    await user.click(method);
    await user.tab({ shift: true });

    expect(method).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders the challenge slot before the production menu', async () => {
    const user = userEvent.setup();
    const leadingItems: NavItem[] = [
      {
        key: 'challenges',
        label: 'Vos enjeux',
        path: null,
        dropdown: [
          {
            key: 'rp',
            label: 'Revenue Process',
            path: '/fr/enjeux/rp',
            icon: Target,
            color: 'yellow',
          },
        ],
      },
    ];
    render(<NavbarBar scrolled={false} leadingItems={leadingItems} />);
    const nav = mainNav();
    const challenges = within(nav).getByRole('button', { name: 'Vos enjeux' });
    const offer = within(nav).getByRole('link', { name: 'Notre Offre' });

    expect(
      challenges.compareDocumentPosition(offer) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(challenges);
    expect(
      within(nav).getByRole('link', { name: 'Revenue Process' }),
    ).toHaveAttribute('href', '/fr/enjeux/rp');
  });

  it('links to the same page in the other language', () => {
    render(<NavbarBar scrolled={false} />, { initialEntries: ['/fr/offer'] });
    const switcher = screen.getAllByRole('navigation', {
      name: 'Choisir la langue',
    })[0];

    expect(within(switcher).getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en/offer',
    );
    expect(within(switcher).getByRole('link', { name: 'FR' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('marks the current page', () => {
    render(<NavbarBar scrolled={false} />, { initialEntries: ['/fr/offer'] });

    expect(
      within(mainNav()).getByRole('link', { name: 'Notre Offre' }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('has no axe violations, closed and with a dropdown open', async () => {
    const user = userEvent.setup();
    const { container } = render(<NavbarBar scrolled />);

    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole('button', { name: 'Ressources' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('NavbarBar mobile menu', () => {
  it('opens from the burger and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} layout="mobile" />);
    const burger = screen.getByRole('button', { name: 'Ouvrir le menu' });

    await user.click(burger);
    const dialog = await screen.findByRole('dialog', { name: 'Menu' });
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(burger).toHaveFocus();
  });

  it('opens groups as accordions and closes on link click', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} layout="mobile" />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    const dialog = await screen.findByRole('dialog', { name: 'Menu' });
    const group = within(dialog).getByRole('button', { name: 'Ressources' });

    expect(group).toHaveAttribute('aria-expanded', 'false');
    await user.click(group);
    expect(group).toHaveAttribute('aria-expanded', 'true');

    // An external link, so the click does not start a router navigation.
    await user.click(
      within(dialog).getByRole('link', { name: /Podcast Revenue Echoes/ }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('has a close button and no axe violations when open', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} layout="mobile" />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
    const dialog = await screen.findByRole('dialog', { name: 'Menu' });

    expect(
      within(dialog).getByRole('button', { name: 'Fermer le menu' }),
    ).toBeInTheDocument();
    expect(await axe(dialog)).toHaveNoViolations();
  });

  it('uses English labels on English pages', async () => {
    render(<NavbarBar scrolled={false} layout="mobile" />, {
      initialEntries: ['/en'],
      i18nLang: 'en',
    });

    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });
});
