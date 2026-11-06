/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import type { ChallengeHero as ChallengeHeroData } from '~/modules/challenge-page';
import { render, screen } from '~/test/utils';

import { ChallengeHero } from './challenge-hero';
import { challengeHeadlineAccent } from './challenge-palette';

const hero: ChallengeHeroData = {
  title: 'Revenue operations',
  titleAccent: 'that hold',
  quote: null,
  lead: null,
  highlight: null,
  cta: null,
  activeStages: [],
  caption: null,
};

function renderHero(data: ChallengeHeroData, challenge: 'sc' | 'ai') {
  render(
    <ChallengeHero
      hero={data}
      challenge={challenge}
      name="Sales Compensation"
      order={3}
      hasDiagnostic={false}
      hasWorkstreams={false}
    />,
    { i18nLang: 'en' },
  );
}

describe('ChallengeHero', () => {
  it('puts the challenge accent class on the second line of the title', () => {
    renderHero(hero, 'sc');

    const heading = screen.getByRole('heading', { level: 1 });
    const accent = screen.getByText('that hold');
    expect(heading).toContainElement(accent);
    expect(accent).toHaveClass(...challengeHeadlineAccent.sc.split(' '));
  });

  it('uses the gradient accent for Revenue AI', () => {
    renderHero(hero, 'ai');

    expect(screen.getByText('that hold')).toHaveClass(
      ...challengeHeadlineAccent.ai.split(' '),
    );
  });

  it('renders a one-line title without an accent', () => {
    renderHero({ ...hero, titleAccent: null }, 'sc');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Revenue operations');
    expect(heading.querySelector('span')).toBeNull();
  });
});
