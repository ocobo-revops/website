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

import { UnifiedBowtie } from './unified-bowtie';

// Ark UI counts `element.focus()` as programmatic focus. Replay a browser Tab
// instead, once Ark's focus tracking has started (see tooltip.test.tsx).
async function focusWithKeyboard(element: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.keyDown(document.body, { key: 'Tab' });
  fireEvent.focus(element);
}

describe('UnifiedBowtie', () => {
  it('renders the seven stages of the model, in order', () => {
    render(
      <main>
        <UnifiedBowtie />
      </main>,
    );

    const names = screen
      .getAllByRole('button')
      .map((button) => button.textContent);
    expect(names).toEqual([
      'Génération de demande',
      'Découverte',
      'Négociation',
      'Signature',
      'Onboarding',
      'Adoption',
      'Expansion',
    ]);
  });

  it('renders the English labels', () => {
    render(
      <main>
        <UnifiedBowtie />
      </main>,
      { i18nLang: 'en' },
    );

    expect(
      screen.getByRole('button', { name: 'Demand generation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Closing' })).toBeInTheDocument();
    expect(screen.getByText('New customer')).toBeInTheDocument();
  });

  it('dims inactive stages and names them as such', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie activeStages={['discovery']} challenge="rp" />
      </main>,
    );

    expect(container.querySelector('[data-stage="discovery"]')).toHaveAttribute(
      'opacity',
      '1',
    );
    expect(
      container.querySelector('[data-stage="negotiation"]'),
    ).toHaveAttribute('opacity', '0.3');
    expect(
      screen.getByRole('button', {
        name: 'Négociation, étape hors périmètre',
      }),
    ).toBeInTheDocument();
  });

  it('tints only the active stages with the challenge colour', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie
          activeStages={['discovery', 'adoption']}
          challenge="cx"
        />
      </main>,
    );

    const slices = container.querySelectorAll('[data-stage-slice]');
    expect(
      [...slices].map((slice) => slice.getAttribute('data-stage-slice')),
    ).toEqual(['discovery', 'adoption']);
  });

  it('leaves the drawing neutral without a challenge', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie />
      </main>,
    );

    expect(container.querySelector('[data-stage-slice]')).toBeNull();
  });

  it('opens a stage tooltip with its KPI and Milestone on keyboard focus', async () => {
    render(
      <main>
        <UnifiedBowtie />
      </main>,
    );
    const trigger = screen.getByRole('button', { name: 'Découverte' });

    await focusWithKeyboard(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Jalon · SQL');
    expect(tooltip).toHaveTextContent('Taux de conversion MQL vers SQL');
  });

  it('opens a stage tooltip on a touch tap', async () => {
    const user = userEvent.setup();
    render(
      <main>
        <UnifiedBowtie />
      </main>,
    );
    const trigger = screen.getByRole('button', { name: 'Signature' });

    await user.pointer({ keys: '[TouchA]', target: trigger });

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Nouveau chiffre signé (ACV)');
  });

  it('has no axe violations, closed and open', async () => {
    const { container } = render(
      <main>
        <UnifiedBowtie
          activeStages={['negotiation', 'closing']}
          challenge="ai"
        />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();

    await focusWithKeyboard(
      screen.getByRole('button', { name: 'Négociation' }),
    );
    await screen.findByRole('tooltip');
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
