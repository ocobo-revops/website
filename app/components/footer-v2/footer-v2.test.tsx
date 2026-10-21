import { describe, expect, it } from 'vitest';

import { axe, render, screen, within } from '~/test/utils';

import { FooterV2 } from './footer-v2';

describe('FooterV2', () => {
  it('renders the link row in the mockup order', () => {
    render(<FooterV2 />);
    const nav = screen.getByRole('navigation', { name: 'Liens du site' });

    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([
      'Podcast Revenue Echoes',
      'Modern Revenue Club',
      'Qui sommes-nous',
      'Success Stories',
      'Librairie RevOps',
      'Nous rejoindre',
    ]);
  });

  it('renders the legal links and the language links', () => {
    render(<FooterV2 />, { initialEntries: ['/fr/offer'] });

    expect(
      screen.getByRole('link', { name: 'Politique de confidentialité' }),
    ).toHaveAttribute('href', '/fr/legal/confidentialite');
    expect(
      screen.getByRole('link', { name: "Conditions d'utilisation" }),
    ).toHaveAttribute('href', '/fr/legal/cgu');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en/offer',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<FooterV2 />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
