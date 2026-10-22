import { describe, expect, it } from 'vitest';

import { challengePalette } from '~/components/challenges/challenge-palette';
import type { ChallengeMenuEntry } from '~/modules/challenge-menu';
import { didChallengeLoadFail } from '~/modules/challenge-menu-state';
import { render, screen, userEvent, waitFor, within } from '~/test/utils';

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

    // Ark's presence unmounts the dialog asynchronously after close.
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Navigation menu' }),
      ).not.toBeInTheDocument(),
    );
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

const frenchChallenges: ChallengeMenuEntry[] = [
  {
    slug: 'sales-experience',
    key: 'se',
    name: 'Sales Experience',
    tagline: "Une organisation commerciale qui passe à l'échelle",
  },
  {
    slug: 'revenue-performance',
    key: 'rp',
    name: 'Revenue Performance',
    tagline: 'Un chiffre que vous voyez venir',
  },
];

const withChallenges = (challenges: ChallengeMenuEntry[], failed = false) => ({
  loaderData: { 'routes/_main': { challenges, failed } },
});

describe('Navbar challenge entry', () => {
  it('is hidden when no challenge is published', () => {
    render(<Navbar />, withChallenges([]));

    expect(
      screen.queryByRole('button', { name: /vos enjeux/i }),
    ).not.toBeInTheDocument();
  });

  it('comes first and lists the challenges in the order given', async () => {
    const user = userEvent.setup();
    render(<Navbar />, withChallenges(frenchChallenges));

    const trigger = screen.getByRole('button', { name: /vos enjeux/i });
    const offer = screen.getByRole('link', { name: 'Notre Offre' });
    expect(
      trigger.compareDocumentPosition(offer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(trigger);

    const items = await screen.findAllByRole('menuitem');
    expect(items.map((item) => item.getAttribute('href'))).toEqual([
      '/fr/challenges/sales-experience',
      '/fr/challenges/revenue-performance',
    ]);
    expect(items[0]).toHaveTextContent('Sales Experience');
    expect(items[0]).toHaveTextContent(
      "Une organisation commerciale qui passe à l'échelle",
    );
  });

  it('tints each item with its challenge palette', async () => {
    const user = userEvent.setup();
    render(<Navbar />, withChallenges(frenchChallenges));

    await user.click(screen.getByRole('button', { name: /vos enjeux/i }));

    const [sales, revenue] = await screen.findAllByRole('menuitem');
    // The item carries the palette for its hover, the icon box for its tint.
    expect(sales).toHaveClass(challengePalette.se);
    expect(sales.getElementsByClassName(challengePalette.se)).toHaveLength(1);
    expect(revenue).toHaveClass(challengePalette.rp);
    expect(revenue).not.toHaveClass(challengePalette.se);
  });

  it('records whether the last load failed, for shouldRevalidate', () => {
    const { unmount } = render(<Navbar />, withChallenges([], true));
    expect(didChallengeLoadFail()).toBe(true);
    unmount();

    // An empty list that loaded fine (flag off, nothing published).
    render(<Navbar />, withChallenges([]));
    expect(didChallengeLoadFail()).toBe(false);
  });

  it('opens, moves and closes with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Navbar />, withChallenges(frenchChallenges));

    const trigger = screen.getByRole('button', { name: /vos enjeux/i });
    trigger.focus();
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'true'),
    );
    const menu = await screen.findByRole('menu');
    // The menu takes focus on a later frame: a key sent before that reaches
    // the trigger instead.
    await waitFor(() => expect(menu).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(
        within(menu).getByRole('menuitem', { name: /revenue performance/i }),
      ).toHaveAttribute('data-highlighted'),
    );

    // Focus return to the trigger after Escape is checked in the browser:
    // Zag restores it on a microtask that jsdom does not run reliably.
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    );
  });

  it('renders in English with English paths', async () => {
    const user = userEvent.setup();
    render(<Navbar />, {
      ...withChallenges([
        {
          slug: 'revenue-performance',
          key: 'rp',
          name: 'Revenue Performance',
          tagline: 'A number you can see coming',
        },
      ]),
      path: ':lang/*',
      initialEntries: ['/en/offer'],
      i18nLang: 'en',
    });

    await user.click(screen.getByRole('button', { name: /your challenges/i }));

    expect(
      await screen.findByRole('menuitem', { name: /revenue performance/i }),
    ).toHaveAttribute('href', '/en/challenges/revenue-performance');
  });

  it('lists the challenges in the mobile menu', async () => {
    const user = userEvent.setup();
    render(<Navbar />, withChallenges(frenchChallenges));

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const drawer = await screen.findByRole('dialog', {
      name: 'Navigation menu',
    });

    expect(within(drawer).getByText('Vos enjeux')).toBeInTheDocument();
    expect(
      within(drawer).getByRole('link', { name: /sales experience/i }),
    ).toHaveAttribute('href', '/fr/challenges/sales-experience');
  });
});
