import { css } from '@ocobo/styled-system/css';

import { ChallengeAiDay } from '~/components/challenges/challenge-ai-day';
import { ChallengeAiThesis } from '~/components/challenges/challenge-ai-thesis';

import { ShowcaseSection } from './showcase-section';

const caption = css({ fontSize: 'caption', color: 'gray', mb: '6' });

export function AiThesisSection() {
  return (
    <ShowcaseSection title="AI thesis">
      <p className={caption}>
        Revenue AI page only (#239). Four steps that loop once the stage is on
        screen; the button pauses them. Under reduced motion the stage holds the
        last step and the button is hidden.
      </p>
      <ChallengeAiThesis />
    </ShowcaseSection>
  );
}

export function AiDaySection() {
  return (
    <ShowcaseSection title="Une journée de commercial">
      <p className={caption}>
        Revenue AI page only (#239). Vertical tabs in the dark tone, one agent
        message per moment, autoplay every six seconds.
      </p>
      <ChallengeAiDay />
    </ShowcaseSection>
  );
}
