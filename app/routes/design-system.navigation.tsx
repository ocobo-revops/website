import type { MetaFunction } from 'react-router';

import { NavbarFooterSection } from '~/components/design-system/navbar-footer-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: navigation',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemNavigation() {
  return <NavbarFooterSection />;
}
