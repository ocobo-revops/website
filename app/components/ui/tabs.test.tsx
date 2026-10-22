/**
 * @vitest-environment jsdom
 */
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  axe,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '~/test/utils';

import { Tabs } from './tabs';
import { nextTabValue } from './tabs-autoplay';

const items = [
  { value: 'cibler', label: 'Cibler', content: <p>Les bons comptes</p> },
  { value: 'preparer', label: 'Préparer', content: <p>Un brief prêt</p> },
  { value: 'capter', label: 'Capter', content: <p>Le compte rendu</p> },
];

const INTERVAL = 1000;

function renderTabs(autoplay = false) {
  return render(
    <main>
      <Tabs
        items={items}
        label="Une journée type"
        autoplay={autoplay}
        interval={INTERVAL}
      />
    </main>,
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });
const pauseButton = () =>
  screen.queryByRole('button', { name: 'Mettre en pause le défilement' });

function requestReducedMotion() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

// Moves the fake clock, letting React apply the autoplay's state updates.
async function wait(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe('nextTabValue', () => {
  it('moves to the next value and wraps round after the last', () => {
    const values = ['a', 'b', 'c'];
    expect(nextTabValue(values, 'a')).toBe('b');
    expect(nextTabValue(values, 'c')).toBe('a');
  });
});

describe('Tabs', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('selects the first tab and shows its panel', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toHaveAccessibleName(
      'Une journée type',
    );
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Les bons comptes');
  });

  // Arrow-key selection is not covered in jsdom: Ark moves the focus there
  // but does not select the tab, so this test checks the focus only. A
  // browser selects the tab too, which the visitor's choice handler relies on.
  it('moves between tabs with the arrow keys', async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(tab('Cibler'));

    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(tab('Préparer')).toHaveFocus());

    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(tab('Capter')).toHaveFocus());

    await user.keyboard('{ArrowLeft}');
    await waitFor(() => expect(tab('Préparer')).toHaveFocus());
  });

  it('has no pause button without autoplay', () => {
    renderTabs();
    expect(pauseButton()).not.toBeInTheDocument();
  });

  it('selects the next tab on its own with autoplay', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    await wait(INTERVAL);
    expect(tab('Préparer')).toHaveAttribute('aria-selected', 'true');
    await wait(INTERVAL);
    await wait(INTERVAL);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
  });

  it('stops the autoplay with the pause button, and resumes it', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    const pause = screen.getByRole('button', {
      name: 'Mettre en pause le défilement',
    });
    await act(async () => pause.click());
    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');

    const resume = screen.getByRole('button', {
      name: 'Reprendre le défilement',
    });
    await act(async () => resume.click());
    await wait(INTERVAL);
    expect(tab('Préparer')).toHaveAttribute('aria-selected', 'true');
  });

  it('stops the autoplay when the visitor chooses a tab', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    await act(async () => tab('Capter').click());
    await wait(INTERVAL * 3);
    expect(tab('Capter')).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('button', { name: 'Reprendre le défilement' }),
    ).toBeInTheDocument();
  });

  it('waits while the keyboard focus is in the tab list', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    await act(async () => tab('Cibler').focus());
    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');

    await act(async () => tab('Cibler').blur());
    await wait(INTERVAL);
    expect(tab('Préparer')).toHaveAttribute('aria-selected', 'true');
  });

  it('waits while the keyboard focus is in the panel', async () => {
    vi.useFakeTimers();
    renderTabs(true);
    const panel = screen.getByRole('tabpanel');

    await act(async () => panel.focus());
    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
    expect(panel).toHaveFocus();
  });

  it('keeps waiting when the window loses focus', async () => {
    vi.useFakeTimers();
    renderTabs(true);
    const panel = screen.getByRole('tabpanel');

    await act(async () => panel.focus());
    // A blur with no relatedTarget while the panel stays the active element,
    // as when the visitor switches to another window.
    fireEvent.blur(panel, { relatedTarget: null });
    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
    expect(panel).toHaveFocus();
  });

  it('resumes at once when the focus moves to the resume button', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    await act(async () => {
      tab('Capter').focus();
      tab('Capter').click();
    });
    const resume = screen.getByRole('button', {
      name: 'Reprendre le défilement',
    });
    await act(async () => {
      resume.focus();
      resume.click();
    });
    await wait(INTERVAL);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps playing while the pointer is over the pause button', async () => {
    vi.useFakeTimers();
    renderTabs(true);

    fireEvent.pointerOver(screen.getByRole('tablist'));
    fireEvent.pointerOver(
      screen.getByRole('button', { name: 'Mettre en pause le défilement' }),
    );
    await wait(INTERVAL);
    expect(tab('Préparer')).toHaveAttribute('aria-selected', 'true');
  });

  it('waits while the pointer is over the tabs', async () => {
    vi.useFakeTimers();
    renderTabs(true);
    const list = screen.getByRole('tablist');

    fireEvent.pointerOver(list);
    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');

    fireEvent.pointerLeave(list.closest('[data-part="root"]') as Element);
    await wait(INTERVAL);
    expect(tab('Préparer')).toHaveAttribute('aria-selected', 'true');
  });

  it('renders nothing without items', () => {
    const { container } = render(<Tabs items={[]} label="Vide" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('selects the first tab when the items drop the selected one', async () => {
    const user = userEvent.setup();
    const { rerender } = renderTabs();
    await user.click(tab('Capter'));

    rerender(
      <main>
        <Tabs items={items.slice(0, 2)} label="Une journée type" />
      </main>,
    );
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Les bons comptes');
  });

  it('does not autoplay when the visitor reduces motion', async () => {
    requestReducedMotion();
    vi.useFakeTimers();
    renderTabs(true);

    await wait(INTERVAL * 3);
    expect(tab('Cibler')).toHaveAttribute('aria-selected', 'true');
  });

  it('has no accessibility violations with autoplay', async () => {
    const { container } = renderTabs(true);
    expect(await axe(container)).toHaveNoViolations();
  });
});
