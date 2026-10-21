import { describe, expect, it } from 'vitest';

import { axe, fireEvent, render, screen, userEvent } from '~/test/utils';

import { FlipCard } from './flip-card';

function renderCard() {
  return render(
    <FlipCard
      label="HubSpot"
      front={<h3>HubSpot</h3>}
      back={
        <>
          <p>La colonne vertébrale du système.</p>
          <a href="/partenaires/hubspot">Voir la page partenaire</a>
        </>
      }
    />,
  );
}

const flipButton = () =>
  screen.getByRole('button', { name: 'Retourner la carte : HubSpot' });

// `user.click` would hover first, and a mouse hover flips the card already.
async function pressFlip(user: ReturnType<typeof userEvent.setup>) {
  flipButton().focus();
  await user.keyboard('{Enter}');
}

const backLink = () =>
  screen.queryByRole('link', { name: 'Voir la page partenaire' });

const faceOf = (text: string) => {
  const face = screen.getByText(text).closest('[class*="flip-card__"]');
  if (!face) throw new Error(`no face around "${text}"`);
  return face;
};

describe('FlipCard', () => {
  it('shows the front and hides the back at first', () => {
    renderCard();
    expect(flipButton()).toHaveAttribute('aria-expanded', 'false');
    expect(backLink()).not.toBeInTheDocument();
    expect(faceOf('La colonne vertébrale du système.')).toHaveAttribute(
      'inert',
    );
    expect(faceOf('HubSpot')).not.toHaveAttribute('inert');
  });

  it.each(['{Enter}', ' '])('flips with %s on its button', async (key) => {
    const user = userEvent.setup();
    renderCard();

    await user.tab();
    expect(flipButton()).toHaveFocus();
    await user.keyboard(key);

    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
    expect(backLink()).toBeInTheDocument();
    expect(faceOf('HubSpot')).toHaveAttribute('inert');
    expect(faceOf('HubSpot')).toHaveAttribute('aria-hidden', 'true');

    // The back link is next in the tab order; the button keeps focus.
    expect(flipButton()).toHaveFocus();
    await user.tab();
    expect(backLink()).toHaveFocus();
  });

  it('flips back on a second press', async () => {
    const user = userEvent.setup();
    renderCard();
    await pressFlip(user);
    await pressFlip(user);
    expect(flipButton()).toHaveAttribute('aria-expanded', 'false');
    expect(backLink()).not.toBeInTheDocument();
  });

  it('flips on a tap on the card surface', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.pointer({
      keys: '[TouchA]',
      target: screen.getByRole('heading', { name: 'HubSpot' }),
    });
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('flips once on a tap on its button', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.pointer({ keys: '[TouchA]', target: flipButton() });
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the back and its focus when a mouse passes over', async () => {
    const user = userEvent.setup();
    renderCard();
    await pressFlip(user);
    await user.tab();
    expect(backLink()).toHaveFocus();

    const backText = screen.getByText('La colonne vertébrale du système.');
    await user.hover(backText);
    await user.unhover(backText);

    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
    expect(backLink()).toHaveFocus();
  });

  it('keeps a tapped link on the back from flipping the card', async () => {
    const user = userEvent.setup();
    renderCard();
    await pressFlip(user);
    const link = backLink();
    if (!link) throw new Error('back link missing');
    link.addEventListener('click', (event) => event.preventDefault());
    await user.pointer({ keys: '[TouchA]', target: link });
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('flips while a mouse hovers it and ignores a mouse click', async () => {
    const user = userEvent.setup();
    renderCard();
    const heading = screen.getByRole('heading', { name: 'HubSpot' });

    await user.hover(heading);
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
    await user.click(heading);
    expect(flipButton()).toHaveAttribute('aria-expanded', 'true');
    await user.unhover(heading);
    expect(flipButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the front again when a hovering mouse clicks the button', async () => {
    const user = userEvent.setup();
    renderCard();
    await user.click(flipButton());
    expect(flipButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('ignores touch pointers entering the card', () => {
    renderCard();
    const root = flipButton().parentElement;
    if (!root) throw new Error('root missing');
    fireEvent.pointerEnter(root, { pointerType: 'touch' });
    expect(flipButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('points its button at the back face', () => {
    renderCard();
    const backId = flipButton().getAttribute('aria-controls');
    expect(backId).toBeTruthy();
    expect(faceOf('La colonne vertébrale du système.')).toHaveAttribute(
      'id',
      backId,
    );
  });

  it('has no axe violations on the front', async () => {
    const { container } = renderCard();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations on the back', async () => {
    const user = userEvent.setup();
    const { container } = renderCard();
    await pressFlip(user);
    expect(backLink()).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('names its button in English on /en', () => {
    render(<FlipCard label="HubSpot" front="front" back="back" />, {
      i18nLang: 'en',
    });
    expect(
      screen.getByRole('button', { name: 'Flip card: HubSpot' }),
    ).toBeInTheDocument();
  });
});
