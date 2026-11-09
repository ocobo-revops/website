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
      within(nav).getByRole('link', { name: 'Clients' }),
    ).toBeInTheDocument();
    for (const name of ['Méthode', 'À propos', 'Ressources']) {
      expect(within(nav).getByRole('button', { name })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    }
    expect(screen.getByTestId('nav-cta')).toHaveTextContent(
      'Échanger avec un architecte',
    );
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
        name: /Méthodologie/,
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

  it('leaves the language switch to the footer', () => {
    render(<NavbarBar scrolled={false} />, { initialEntries: ['/fr/offer'] });

    expect(
      screen.queryByRole('navigation', { name: 'Choisir la langue' }),
    ).toBeNull();
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

describe('NavbarBar panels (#315)', () => {
  const challenges: NavItem = {
    key: 'challenges',
    label: 'Vos enjeux',
    path: null,
    dropdown: [
      {
        key: 'challenge-rp',
        label: 'Revenue Process',
        description: 'Structurer un process qui convertit',
        path: '/fr/challenges/rp',
        color: 'yellow',
      },
    ],
  };

  function openPanel(name: string) {
    const button = screen.getByRole('button', { name });
    return {
      button,
      panel: () =>
        document.getElementById(
          button.getAttribute('aria-controls') ?? '',
        ) as HTMLElement,
    };
  }

  it('names each challenge row with the challenge and its tagline', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
    const { button, panel } = openPanel('Vos enjeux');

    await user.click(button);

    expect(
      within(panel()).getByRole('link', {
        name: 'Revenue Process: Structurer un process qui convertit',
      }),
    ).toBeInTheDocument();
  });

  describe('hover', () => {
    it('keeps the next panel open when the pointer moves across', async () => {
      const user = userEvent.setup();
      render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
      const first = openPanel('Vos enjeux');
      const second = openPanel('Méthode');

      await user.hover(first.button);
      expect(first.button).toHaveAttribute('aria-expanded', 'true');
      await user.unhover(first.button);
      await user.hover(second.button);
      // Past the 250ms close delay of the panel the pointer left.
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(second.button).toHaveAttribute('aria-expanded', 'true');
      expect(first.button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes a panel opened by hover on Escape', async () => {
      const user = userEvent.setup();
      render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
      const { button } = openPanel('Vos enjeux');

      await user.hover(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      await user.keyboard('{Escape}');

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps a hovered panel open while focus is inside it', async () => {
      const user = userEvent.setup();
      render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
      const { button, panel } = openPanel('Vos enjeux');

      await user.hover(button);
      within(panel()).getAllByRole('link')[0].focus();
      await user.unhover(button);
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('pins a hovered panel on click, so leaving keeps it open', async () => {
      const user = userEvent.setup();
      render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
      const { button } = openPanel('Vos enjeux');

      await user.click(button);
      // Clicks do not focus buttons in every browser (Safari).
      button.blur();
      await user.unhover(button);
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes a hovered panel on Enter', async () => {
      const user = userEvent.setup();
      render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
      const { button } = openPanel('Vos enjeux');

      await user.hover(button);
      button.focus();
      await user.keyboard('{Enter}');

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('toggles a panel on tap', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
    const { button } = openPanel('Vos enjeux');

    await user.pointer({ keys: '[TouchA]', target: button });
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.pointer({ keys: '[TouchA]', target: button });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the numbered challenges, the scope card and the contact footer', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} leadingItems={[challenges]} />);
    const { button, panel } = openPanel('Vos enjeux');

    await user.click(button);
    const content = within(panel());

    const row = content.getByRole('link', { name: /Structurer un process/ });
    expect(row).toHaveAttribute('href', '/fr/challenges/rp');
    expect(row).toHaveTextContent(/^01/);
    expect(
      content.getByRole('link', { name: /Notre périmètre/ }),
    ).toHaveAttribute('href', '/fr/method#perimetre');
    expect(
      content.getByRole('link', { name: 'Échanger avec un architecte' }),
    ).toHaveAttribute('href', '/fr/contact');
  });

  it('links the method chips to anchors of their page', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} />);
    const { button, panel } = openPanel('Méthode');

    await user.click(button);
    const chips = within(panel()).getAllByRole('list', {
      name: /^Sections de la page/,
    });
    const hrefs = chips.flatMap((list) =>
      within(list)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    );

    expect(hrefs).toEqual([
      '/fr/method#piliers',
      '/fr/method#perimetre',
      '/fr/technology#badges',
      '/fr/studio#squad',
      '/fr/studio#expertises',
    ]);
  });

  function methodItems(roiHidden: boolean): NavItem[] {
    return [
      {
        key: 'method',
        label: 'Méthode',
        path: null,
        dropdown: [
          {
            key: 'framework',
            label: 'Méthodologie',
            path: '/fr/method',
            color: 'yellow',
          },
        ],
      },
      {
        key: 'resources',
        label: 'Ressources',
        path: null,
        dropdown: [
          {
            key: 'roi',
            label: 'Calculateur ROI',
            path: '/fr/roi',
            color: 'mint',
            shouldHide: roiHidden,
          },
        ],
      },
    ];
  }

  it('hides the ROI card while the ROI page is off', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} items={methodItems(true)} />);
    const { button, panel } = openPanel('Méthode');

    await user.click(button);

    expect(
      within(panel()).queryByRole('link', { name: /ROI/ }),
    ).not.toBeInTheDocument();
    expect(
      within(panel()).getByRole('link', { name: /Méthodologie/ }),
    ).toBeInTheDocument();
  });

  it('shows the ROI card once the ROI page is on', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} items={methodItems(false)} />);
    const { button, panel } = openPanel('Méthode');

    await user.click(button);

    expect(within(panel()).getByRole('link', { name: /ROI/ })).toHaveAttribute(
      'href',
      '/fr/roi',
    );
  });

  it('uses English labels and paths on English pages', async () => {
    const user = userEvent.setup();
    render(<NavbarBar scrolled={false} leadingItems={[challenges]} />, {
      initialEntries: ['/en'],
      path: '/:lang',
      i18nLang: 'en',
    });
    const { button, panel } = openPanel('Vos enjeux');

    await user.click(button);

    expect(
      within(panel()).getByRole('link', { name: /Our scope/ }),
    ).toHaveAttribute('href', '/en/method#perimetre');
    expect(
      within(panel()).getByText('Not sure where to start?'),
    ).toBeInTheDocument();
  });

  it('renders the IA entry as a plain link', () => {
    const items: NavItem[] = [
      { key: 'ai', label: 'IA', path: '/fr/challenges/ai' },
    ];
    render(<NavbarBar scrolled={false} items={items} />);

    expect(within(mainNav()).getByRole('link', { name: 'IA' })).toHaveAttribute(
      'href',
      '/fr/challenges/ai',
    );
  });

  it('has no axe violations with the challenge panel open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NavbarBar scrolled leadingItems={[challenges]} />,
    );

    await user.click(screen.getByRole('button', { name: 'Vos enjeux' }));
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
