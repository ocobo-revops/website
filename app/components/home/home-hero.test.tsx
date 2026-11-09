/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { axe, render, screen, userEvent } from '~/test/utils';

import { HomeHero } from './home-hero';

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

beforeEach(() => {
  stubReducedMotion(false);
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    },
  );
  // The clock is covered by the hook tests: keep the frames from running.
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HomeHero', () => {
  it('renders the English copy', () => {
    render(<HomeHero />, { i18nLang: 'en' });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /fluid across your teams/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/single RevOps axis/, { selector: 'p' }),
    ).toBeInTheDocument();
  });

  it('renders an h2 where the page has its h1', () => {
    render(<HomeHero titleAs="h2" />, { i18nLang: 'en' });

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
  });

  it('keeps the punctuation after the tag on its line', () => {
    render(<HomeHero />, { i18nLang: 'fr' });

    const tag = screen.getByText('simple');
    expect(tag.parentElement?.textContent).toBe('simple,');
  });

  it('switches the pause button label', async () => {
    render(<HomeHero />, { i18nLang: 'en' });
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: /pause/i });
    await user.click(button);

    expect(button).toHaveAccessibleName(/resume/i);
  });

  it('shows the settled picture without the button under reduced motion', () => {
    stubReducedMotion(true);
    render(<HomeHero />, { i18nLang: 'en' });

    expect(screen.queryByRole('button', { name: /pause/i })).toBeNull();
    expect(screen.getByText('simple')).toHaveStyle({ opacity: '1' });
  });

  it('has no axe violations', async () => {
    const { container } = render(<HomeHero />, { i18nLang: 'fr' });

    expect(await axe(container)).toHaveNoViolations();
  });
});
