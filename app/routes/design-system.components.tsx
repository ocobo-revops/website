import type { MetaFunction } from 'react-router';

import { ButtonBadgeEyebrowSections } from '~/components/design-system/button-badge-eyebrow-sections';
import { ButtonsSection } from '~/components/design-system/buttons-section';
import { CardRecipeSection } from '~/components/design-system/card-recipe-section';
import { FlipCardSection } from '~/components/design-system/flip-card-section';
import { FormSection } from '~/components/design-system/form-section';
import { MetaPillSection } from '~/components/design-system/meta-pill-section';
import { PersonCardSection } from '~/components/design-system/person-card-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { TabsSection } from '~/components/design-system/tabs-section';
import { TooltipSection } from '~/components/design-system/tooltip-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: components',
    description: designSystemDescription,
    locale: 'fr',
  });
};

// UI components and recipes. Add a section by creating a module under
// `app/components/design-system/` and placing it in the list below.
export default function DesignSystemComponents() {
  return (
    <>
      <ButtonsSection />
      <ButtonBadgeEyebrowSections />
      <FormSection />
      <MetaPillSection />
      <CardRecipeSection />
      <FlipCardSection />
      <PersonCardSection />
      <TooltipSection />
      <TabsSection />
    </>
  );
}
