import type { MetaFunction } from 'react-router';

import {
  AiDaySection,
  AiThesisSection,
} from '~/components/design-system/challenge-sections-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: challenge sections',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemChallengeSections() {
  return (
    <>
      <AiThesisSection />
      <AiDaySection />
    </>
  );
}
