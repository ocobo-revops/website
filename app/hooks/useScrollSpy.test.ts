// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollSpy } from './useScrollSpy';

const SECTION_IDS = ['mission', 'competences', 'pourquoi'] as const;

let observerCallback: IntersectionObserverCallback;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

function makeMockEntry(
  id: string,
  isIntersecting: boolean,
): IntersectionObserverEntry {
  const el = document.getElementById(id) ?? document.createElement('div');
  return {
    target: el,
    isIntersecting,
    boundingClientRect: el.getBoundingClientRect(),
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: el.getBoundingClientRect(),
    rootBounds: null,
    time: 0,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const id of SECTION_IDS) {
    const el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);
  }

  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((cb: IntersectionObserverCallback) => {
      observerCallback = cb;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
        unobserve: vi.fn(),
      };
    }),
  );
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('useScrollSpy', () => {
  it('returns null initially (SSR-safe deterministic value)', () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));
    expect(result.current).toBeNull();
  });

  it('updates to the intersecting section id', () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));

    act(() => {
      observerCallback(
        [makeMockEntry('competences', true)],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe('competences');
  });

  it('does not update when entry is not intersecting', () => {
    const { result } = renderHook(() => useScrollSpy(SECTION_IDS));

    act(() => {
      observerCallback(
        [makeMockEntry('mission', true)],
        {} as IntersectionObserver,
      );
    });
    act(() => {
      observerCallback(
        [makeMockEntry('mission', false)],
        {} as IntersectionObserver,
      );
    });

    expect(result.current).toBe('mission');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() => useScrollSpy(SECTION_IDS));
    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});
