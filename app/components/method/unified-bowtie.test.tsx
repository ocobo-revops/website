/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import { css } from '@ocobo/styled-system/css';

import {
  axe,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '~/test/utils';

import { type BowtieChallenge, UnifiedBowtie } from './unified-bowtie';

// Ark UI counts `element.focus()` as programmatic focus. Replay a browser Tab
// instead, once Ark's focus tracking has started (see tooltip.test.tsx).
async function focusWithKeyboard(element: HTMLElement) {
  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.keyDown(document.body, { key: 'Tab' });
  fireEvent.focus(element);
}

async function openStageTooltip(name: string, challenge?: BowtieChallenge) {
  const view = render(
    <main>
      <UnifiedBowtie activeStages={['discovery']} challenge={challenge} />
    </main>,
  );
  await focusWithKeyboard(screen.getByRole('button', { name }));
  const tooltip = await screen.findByRole('tooltip');
  view.unmount();
  return tooltip;
}

// The same style objects as the component, so the classes match.
const activeBorder = css({
  borderTopWidth: '4px',
  borderTopColor: 'colorPalette',
});
const inactiveBorder = css({
  borderTopWidth: '4px',
  borderTopColor: 'gray.300',
});

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
  });

  it('dims inactive stages and names them as such', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie activeStages={['discovery']} challenge="rp" />
      </main>,
    );

    expect(
      container.querySelector('[data-stage-column="discovery"]'),
    ).toHaveAttribute('data-state', 'active');
    expect(
      container.querySelector('[data-stage-column="negotiation"]'),
    ).toHaveAttribute('data-state', 'inactive');
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

    expect(screen.getByRole('group')).toHaveClass(
      css({ colorPalette: 'challenge.cx' }),
    );
    const tinted = [...container.querySelectorAll('[data-stage-tint]')];
    expect(
      tinted.map((tint) =>
        tint.closest('[data-stage-column]')?.getAttribute('data-stage-column'),
      ),
    ).toEqual(['discovery', 'adoption']);
    for (const tint of tinted) {
      expect(tint).toHaveClass(css({ stroke: 'colorPalette' }));
    }
  });

  it('borders the tooltip in the challenge colour on active stages only', async () => {
    const active = await openStageTooltip('Découverte', 'sy');
    expect(active).toHaveClass(activeBorder);
    expect(active).not.toHaveClass(inactiveBorder);

    const inactive = await openStageTooltip(
      'Signature, étape hors périmètre',
      'sy',
    );
    expect(inactive).toHaveClass(inactiveBorder);
    expect(inactive).not.toHaveClass(activeBorder);

    const neutral = await openStageTooltip('Découverte');
    expect(neutral).not.toHaveClass(activeBorder);
    expect(neutral).not.toHaveClass(inactiveBorder);
  });

  it('shows a KPI chip under each active stage of a challenge', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie
          activeStages={['discovery', 'negotiation']}
          challenge="rp"
        />
      </main>,
    );

    const chips = container.querySelectorAll('[data-stage-chip]');
    expect([...chips].map((chip) => chip.textContent)).toEqual([
      'Découverte, MQL vers SQL',
      'Négociation, Win rate',
    ]);
  });

  it('leaves the drawing neutral without a challenge', () => {
    const { container } = render(
      <main>
        <UnifiedBowtie />
      </main>,
    );

    const tints = container.querySelectorAll('[data-stage-tint]');
    expect(tints).toHaveLength(7);
    for (const tint of tints) {
      expect(tint).toHaveAttribute('data-stage-tint', 'neutral');
      expect(tint).not.toHaveClass(css({ stroke: 'colorPalette' }));
    }
    expect(container.querySelector('[data-stage-chip]')).toBeNull();
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
    const parts = tooltip.querySelector('[data-stage-kpi="discovery"]');
    expect(
      [...(parts?.children ?? [])].map((part) => part.textContent),
    ).toEqual([
      'Jalon · SQL',
      'Taux de conversion MQL vers SQL',
      'La part des leads que la vente accepte et travaille réellement.',
    ]);
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
