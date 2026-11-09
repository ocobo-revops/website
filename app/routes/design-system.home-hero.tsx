import type { MetaFunction } from 'react-router';

import { HomeHeroSection } from '~/components/design-system/home-hero-section';
import { designSystemDescription } from '~/components/design-system/subpages';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system: home hero',
    description: designSystemDescription,
    locale: 'fr',
  });
};

export default function DesignSystemHomeHero() {
  return <HomeHeroSection />;
}
