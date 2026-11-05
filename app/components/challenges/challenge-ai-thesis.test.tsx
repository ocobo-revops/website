/**
 * @vitest-environment jsdom
 */
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { axe, fireEvent, render, screen } from '~/test/utils';

import { ChallengeAiThesis, STEP_DURATIONS } from './challenge-ai-thesis';

// Reports every observed element as on screen at once.
class VisibleObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element) {
    this.callback(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
  disconnect() {
    // Nothing to release.
  }
  unobserve() {
    // Nothing to release.
  }
  takeRecords() {
    return [];
  }
}

function requestReducedMotion() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

async function wait(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

const currentStep = () =>
  document.querySelector('[aria-current="step"]')?.textContent;
const pauseButton = () =>
  screen.queryByRole('button', { name: "Mettre en pause l'animation" });

describe('ChallengeAiThesis', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows the finished picture without IntersectionObserver', () => {
    render(<ChallengeAiThesis />);

    expect(document.getElementById('contexte')).not.toBeNull();
    expect(currentStep()).toContain('Activer');
    expect(
      screen.getByRole('img', { name: /^Animation : des outils/ }),
    ).toBeInTheDocument();
  });

  it('loops through the steps once on screen, from the last one when it starts in view', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', VisibleObserver);
    render(<ChallengeAiThesis />);

    // JSDOM lays everything out at the top: the stage starts in view.
    expect(currentStep()).toContain('Activer');
    await wait(STEP_DURATIONS[3]);
    expect(currentStep()).toContain('Éparpillé');
    await wait(STEP_DURATIONS[0]);
    expect(currentStep()).toContain('Nettoyer');
  });

  it('starts from the first step when it scrolls into view from below the fold', async () => {
    vi.useFakeTimers();
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight + 400,
    } as DOMRect);
    let reveal: (() => void) | undefined;
    class LaterObserver {
      constructor(private readonly callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        reveal = () =>
          this.callback(
            [{ isIntersecting: true, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      disconnect() {
        // Nothing to release.
      }
    }
    vi.stubGlobal('IntersectionObserver', LaterObserver);
    render(<ChallengeAiThesis />);

    expect(currentStep()).toContain('Éparpillé');
    await wait(20_000);
    expect(currentStep()).toContain('Éparpillé');

    await act(async () => reveal?.());
    await wait(STEP_DURATIONS[0]);
    expect(currentStep()).toContain('Nettoyer');
  });

  it('holds the step while paused, and resumes from the button', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', VisibleObserver);
    render(<ChallengeAiThesis />);

    const button = pauseButton();
    expect(button).not.toBeNull();
    fireEvent.click(button as HTMLElement);
    await wait(20_000);
    expect(currentStep()).toContain('Activer');

    fireEvent.click(
      screen.getByRole('button', { name: "Reprendre l'animation" }),
    );
    await wait(STEP_DURATIONS[3]);
    expect(currentStep()).toContain('Éparpillé');
  });

  it('holds still on the last step under reduced motion', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('IntersectionObserver', VisibleObserver);
    requestReducedMotion();
    render(<ChallengeAiThesis />);

    await wait(20_000);
    expect(currentStep()).toContain('Activer');
  });

  it('renders the English copy', () => {
    render(<ChallengeAiThesis />, { i18nLang: 'en' });

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Your AI agents will never be better than the data and processes you give them.',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Pause the animation' }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ChallengeAiThesis />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
