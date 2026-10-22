import type { MetaFunction } from 'react-router';

import { MotionSection } from '~/components/design-system/motion-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: motion',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemMotion() {
  return <MotionSection />;
}
