import type { MetaFunction } from 'react-router';

import { designSystemDescription } from '~/components/design-system/subpages';
import { TypographySection } from '~/components/design-system/typography-section';
import {
  FontSizesSection,
  TypeScaleSection,
} from '~/components/design-system/v2-tokens-section';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: typography',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemTypography() {
  return (
    <>
      <TypeScaleSection />
      <FontSizesSection />
      <TypographySection />
    </>
  );
}
