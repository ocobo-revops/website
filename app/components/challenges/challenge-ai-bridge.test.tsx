/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import { buildChallengePage } from '~/modules/challenge-page';
import { loadChallengeFixture } from '~/test/challenge-fixture';
import { axe, render, screen } from '~/test/utils';

import { ChallengeAiBridge } from './challenge-ai-bridge';

const { frontmatter } = loadChallengeFixture('fr', 'sales-compensation');
const aiBridge = buildChallengePage(frontmatter).aiBridge;
if (!aiBridge?.demo) throw new Error('fixture has an AI bridge with a demo');

describe('ChallengeAiBridge', () => {
  it('names the agent window after its agent', () => {
    render(
      <ChallengeAiBridge
        aiBridge={aiBridge}
        challenge="sc"
        aiChallengeSlug="revenue-ai"
      />,
      { i18nLang: 'fr' },
    );

    expect(
      screen.getByRole('figure', {
        name: `Exemple de message : ${aiBridge.demo?.agent}`,
      }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ChallengeAiBridge
        aiBridge={aiBridge}
        challenge="sc"
        aiChallengeSlug="revenue-ai"
      />,
      { i18nLang: 'fr' },
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
