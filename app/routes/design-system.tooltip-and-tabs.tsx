import type { MetaFunction } from 'react-router';

import { designSystemDescription } from '~/components/design-system/subpages';
import { TabsSection } from '~/components/design-system/tabs-section';
import { TooltipSection } from '~/components/design-system/tooltip-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: tooltip and tabs',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemTooltipAndTabs() {
  return (
    <>
      <TooltipSection />
      <TabsSection />
    </>
  );
}
