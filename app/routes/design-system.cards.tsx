import type { MetaFunction } from 'react-router';

import { CardRecipeSection } from '~/components/design-system/card-recipe-section';
import { FlipCardSection } from '~/components/design-system/flip-card-section';
import { PersonCardSection } from '~/components/design-system/person-card-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: cards',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemCards() {
  return (
    <>
      <CardRecipeSection />
      <FlipCardSection />
      <PersonCardSection />
    </>
  );
}
