import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { ContactCta } from './contact-cta';

describe('ContactCta', () => {
  it('opens the French contact page on a French page', async () => {
    render(<ContactCta />, {
      initialEntries: ['/fr/challenges/x'],
      path: ':lang/*',
      i18nLang: 'fr',
    });

    expect(
      await screen.findByRole('link', { name: 'Échanger avec un architecte' }),
    ).toHaveAttribute('href', '/fr/contact');
  });

  it('opens the English contact page on an English page', async () => {
    render(<ContactCta>Talk to one of us</ContactCta>, {
      initialEntries: ['/en'],
      path: ':lang/*',
      i18nLang: 'en',
    });

    expect(
      await screen.findByRole('link', { name: 'Talk to one of us' }),
    ).toHaveAttribute('href', '/en/contact');
  });
});
