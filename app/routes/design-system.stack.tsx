import type { MetaFunction } from 'react-router';

import { StackDiagramSection } from '~/components/design-system/stack-diagram-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: stack diagram',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemStack() {
  return <StackDiagramSection />;
}
