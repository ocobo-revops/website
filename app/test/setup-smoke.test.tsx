import { describe, expect, it } from 'vitest';

import { axe, render, screen, userEvent } from '~/test/utils';

function SmokeButton() {
  return <button type="button">Smoke me</button>;
}

describe('test setup smoke', () => {
  it('renders a component through the helper', () => {
    render(<SmokeButton />);
    expect(
      screen.getByRole('button', { name: 'Smoke me' }),
    ).toBeInTheDocument();
  });

  it('exposes user-event and reacts to a click', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(
      <button type="button" onClick={() => (clicked = true)}>
        Click target
      </button>,
    );
    await user.click(screen.getByRole('button', { name: 'Click target' }));
    expect(clicked).toBe(true);
  });

  it('runs jest-axe with no violations', async () => {
    const { container } = render(<SmokeButton />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
