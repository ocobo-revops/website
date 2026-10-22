import type { MetaFunction } from 'react-router';

import { FormSection } from '~/components/design-system/form-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: forms',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemForms() {
  return <FormSection />;
}
