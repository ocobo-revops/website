import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { LanguageLinks } from './language-links';

describe('LanguageLinks', () => {
  it('reads the current language from the path, not from i18n', () => {
    // i18n says French: only the `/en` prefix can mark EN current.
    render(<LanguageLinks />, {
      initialEntries: ['/en/clients/acme'],
      i18nLang: 'fr',
    });

    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute(
      'href',
      '/fr/clients/acme',
    );
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('link', { name: 'FR' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('links the bare English home page to the French one', () => {
    render(<LanguageLinks />, { initialEntries: ['/en'], i18nLang: 'en' });

    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute(
      'href',
      '/fr',
    );
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en',
    );
  });

  it('marks the i18n language current on an unprefixed blog page', () => {
    render(<LanguageLinks />, {
      initialEntries: ['/blog/some-post'],
      i18nLang: 'en',
    });

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('link', { name: 'FR' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute(
      'href',
      '/fr',
    );
  });
});
