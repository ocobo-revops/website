/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import {
  axe,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '~/test/utils';

import { Tooltip } from './tooltip';

function renderTooltip() {
  render(
    <main>
      <Tooltip content="Volume de MQL et coût par MQL">MQL</Tooltip>
      <button type="button">Ailleurs</button>
    </main>,
  );
  return screen.getByRole('button', { name: 'MQL' });
}

// user-event's `tab()` moves focus with `element.focus()`, which Ark UI counts
// as programmatic focus, not keyboard focus. Replay what a browser does on
// Tab instead: a keydown, then a focus event on the trigger. Ark starts its
// focus tracking after mount, so let that run first.
async function focusWithKeyboard(element: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.keyDown(document.body, { key: 'Tab' });
  fireEvent.focus(element);
}

describe('Tooltip', () => {
  it('is closed by default', () => {
    renderTooltip();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus and describes the trigger', async () => {
    const trigger = renderTooltip();

    await focusWithKeyboard(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Volume de MQL et coût par MQL');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('opens on hover', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.hover(trigger);

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('opens on click and closes on a second click', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.click(trigger);
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('opens on a touch tap', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.pointer({ keys: '[TouchA]', target: trigger });

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('closes on a second touch tap', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.pointer({ keys: '[TouchA]', target: trigger });
    await screen.findByRole('tooltip');
    await user.pointer({ keys: '[TouchA]', target: trigger });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('stays open while the pointer moves onto it', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.hover(trigger);
    const tooltip = await screen.findByRole('tooltip');
    await user.hover(tooltip);
    // Longer than the close delay, so a pending close would have run.
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('closes on Escape after a tap opened it', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.pointer({ keys: '[TouchA]', target: trigger });
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('renders a trigger that does not submit forms', () => {
    const trigger = renderTooltip();
    expect(trigger).toHaveAttribute('type', 'button');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await focusWithKeyboard(trigger);
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('closes on a tap outside', async () => {
    const user = userEvent.setup();
    const trigger = renderTooltip();

    await user.pointer({ keys: '[TouchA]', target: trigger });
    await screen.findByRole('tooltip');
    await user.pointer({
      keys: '[TouchA]',
      target: screen.getByRole('button', { name: 'Ailleurs' }),
    });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('has no axe violations when open', async () => {
    const trigger = renderTooltip();

    await focusWithKeyboard(trigger);
    await screen.findByRole('tooltip');

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
