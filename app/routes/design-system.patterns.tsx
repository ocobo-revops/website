import type { MetaFunction } from 'react-router';

import { BowtieSection } from '~/components/design-system/bowtie-section';
import { MotionSection } from '~/components/design-system/motion-section';
import { NavbarFooterSection } from '~/components/design-system/navbar-footer-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: patterns',
    description: designSystemDescription,
    locale: 'fr',
  });
};

// Page blocks and motion. Add a section by creating a module under
// `app/components/design-system/` and placing it in the list below.
// `MotionSection` carries its own scroll room before and after its demos, so
// its reveals and scroll progress still show wherever it sits in the list.
export default function DesignSystemPatterns() {
  return (
    <>
      <NavbarFooterSection />
      <BowtieSection />
      <MotionSection />
    </>
  );
}
