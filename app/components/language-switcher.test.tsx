import { useNavigate, useParams } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '~/test/utils';

import { LanguageSwitcher } from './LanguageSwitcher';

const mockNavigate = vi.fn();

// useParams and useNavigate are mocked so tests control params without
// needing a route with a /:lang segment. useLocation is intentionally left
// real — the memory router's initialEntries provides the pathname that the
// component uses to build the converted path.
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({});
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
});

describe('LanguageSwitcher', () => {
  it('returns null when route has no lang param', () => {
    render(<LanguageSwitcher />);
    expect(
      screen.queryByRole('combobox', { name: 'Lang' }),
    ).not.toBeInTheDocument();
  });

  it('renders language trigger when lang param is present', () => {
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox', { name: 'Lang' })).toBeInTheDocument();
  });

  it('navigates en → fr preserving subpath', async () => {
    const user = userEvent.setup();
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    render(<LanguageSwitcher />, {
      initialEntries: ['/en/some-page'],
      i18nLang: 'en',
    });

    await user.click(screen.getByRole('combobox', { name: 'Lang' }));
    await user.click(await screen.findByRole('option', { name: /français/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/fr/some-page');
  });

  it('navigates fr → en preserving subpath', async () => {
    const user = userEvent.setup();
    vi.mocked(useParams).mockReturnValue({ lang: 'fr' });
    render(<LanguageSwitcher />, {
      initialEntries: ['/fr/methode/discovery'],
      i18nLang: 'fr',
    });

    await user.click(screen.getByRole('combobox', { name: 'Lang' }));
    // In FR context, English option label is "Anglais"
    await user.click(await screen.findByRole('option', { name: /anglais/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/en/methode/discovery');
  });
});
