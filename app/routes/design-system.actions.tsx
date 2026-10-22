import type { MetaFunction } from 'react-router';

import { ButtonBadgeEyebrowSections } from '~/components/design-system/button-badge-eyebrow-sections';
import { ButtonsSection } from '~/components/design-system/buttons-section';
import { MetaPillSection } from '~/components/design-system/meta-pill-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: actions',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemActions() {
  return (
    <>
      <ButtonsSection />
      <ButtonBadgeEyebrowSections />
      <MetaPillSection />
    </>
  );
}
