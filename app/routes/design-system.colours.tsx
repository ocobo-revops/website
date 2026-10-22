import type { MetaFunction } from 'react-router';

import { ColorsSection } from '~/components/design-system/colors-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import {
  AiGradientsSection,
  ChallengeColoursSection,
  GreysSection,
} from '~/components/design-system/v2-tokens-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: colours',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemColours() {
  return (
    <>
      <GreysSection />
      <ChallengeColoursSection />
      <AiGradientsSection />
      <ColorsSection />
    </>
  );
}
