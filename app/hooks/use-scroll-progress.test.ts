// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useScrollProgress } from './use-scroll-progress';

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useScrollProgress', () => {
  it('returns the final state at once under reduced motion', () => {
    stubReducedMotion(true);
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.enabled).toBe(false);
    expect(result.current.progress.get()).toBe(1);
  });

  it('tracks scroll from the top without reduced motion', () => {
    stubReducedMotion(false);
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current.enabled).toBe(true);
    expect(result.current.progress.get()).toBe(0);
  });
});
