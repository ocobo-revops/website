/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

import { render, screen } from '~/test/utils';

import { ChallengeStack, joinedStyles } from './challenge-stack';

function parts() {
  const heading = screen.getByRole('heading', { level: 2 });
  const section = heading.closest('section');
  // The heading block: the grid that holds the H2 column and the CTA.
  const header = heading.parentElement?.parentElement;
  if (!section || !header) throw new Error('stack section not found');
  return { section, header };
}

describe('ChallengeStack', () => {
  it('joins the white section before it: no top padding, a hairline', () => {
    render(<ChallengeStack joined />, { i18nLang: 'fr' });

    const { section, header } = parts();
    expect(section).toHaveClass(joinedStyles.section);
    expect(header).toHaveClass(joinedStyles.header);
  });

  it('stands alone without workstreams or partner: top padding, no border', () => {
    render(<ChallengeStack joined={false} />, { i18nLang: 'fr' });

    const { section, header } = parts();
    expect(section).not.toHaveClass(joinedStyles.section);
    expect(header).not.toHaveClass(joinedStyles.header);
  });
});
