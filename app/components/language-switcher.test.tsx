import { useNavigate, useParams } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '~/test/utils';

import { LanguageSwitcher } from './LanguageSwitcher';

const mockNavigate = vi.fn();

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

  it('navigates to target language path on selection', async () => {
    const user = userEvent.setup();
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    render(<LanguageSwitcher />, {
      initialEntries: ['/en/some-page'],
      i18nLang: 'en',
    });

    await user.click(screen.getByRole('combobox', { name: 'Lang' }));
    await user.click(await screen.findByText('Français'));

    expect(mockNavigate).toHaveBeenCalledWith('/fr/some-page');
  });
});
