import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { LanguageLinks } from './language-links';

describe('LanguageLinks', () => {
  it('links an English page to its French twin and marks EN current', () => {
    render(<LanguageLinks />, {
      initialEntries: ['/en/clients/acme'],
      i18nLang: 'en',
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

  it('marks the i18n language current on an unprefixed blog page', () => {
    render(<LanguageLinks />, {
      initialEntries: ['/blog/some-post'],
      i18nLang: 'en',
    });

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('link', { name: 'FR' })).toHaveAttribute(
      'href',
      '/fr',
    );
  });
});
