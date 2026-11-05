import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocalizedPathname } from './useLocalizedPathname';

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useParams: vi.fn() };
});

beforeEach(() => {
  vi.mocked(useParams).mockReturnValue({});
});

describe('useLocalizedPathname', () => {
  it('prefixes a link with the current language', () => {
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    const { result } = renderHook(() => useLocalizedPathname());

    expect(result.current('/offer')).toBe('/en/offer');
  });

  it('maps the home link to the bare language prefix', () => {
    vi.mocked(useParams).mockReturnValue({ lang: 'en' });
    const { result } = renderHook(() => useLocalizedPathname());

    expect(result.current('/')).toBe('/en');
  });

  it('prefixes with French on a page without ($lang) segment', () => {
    const { result } = renderHook(() => useLocalizedPathname());

    expect(result.current('/contact')).toBe('/fr/contact');
  });

  it('throws the 404 Response when building a link under an unknown prefix', () => {
    vi.mocked(useParams).mockReturnValue({ lang: 'de' });
    const { result } = renderHook(() => useLocalizedPathname());

    let thrown: unknown;
    try {
      result.current('/offer');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
  });
});
