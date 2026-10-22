import type { MetaFunction } from 'react-router';

import { IconsSection } from '~/components/design-system/icons-section';
import { IllustrationsSection } from '~/components/design-system/illustrations-section';
import { LogoSection } from '~/components/design-system/logo-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: brand',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemBrand() {
  return (
    <>
      <LogoSection />
      <IconsSection />
      <IllustrationsSection />
    </>
  );
}
