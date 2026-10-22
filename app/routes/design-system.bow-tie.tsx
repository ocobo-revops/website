import type { MetaFunction } from 'react-router';

import { BowtieSection } from '~/components/design-system/bowtie-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: bow tie',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemBowTie() {
  return <BowtieSection />;
}
