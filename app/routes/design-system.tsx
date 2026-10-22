import type { MetaFunction } from 'react-router';
import { Outlet } from 'react-router';

import { css } from '@ocobo/styled-system/css';

import { SubpageNav } from '~/components/design-system/subpage-nav';
import { designSystemDescription } from '~/components/design-system/subpages';
import { Container } from '~/components/ui/Container';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system',
    description: designSystemDescription,
    locale: 'fr',
  });
};

// Each showcase section lives in its own module under
// `app/components/design-system/`. Add a section by creating a module there
// and placing it in the subpage route it belongs to:
// - tokens and visual basics: `design-system.foundations.tsx`
// - UI components and recipes: `design-system.components.tsx`
// - page blocks and motion: `design-system.patterns.tsx`
// A new subpage also needs an entry in `designSystemSubpages`.
export default function DesignSystemLayout() {
  return (
    <Container>
      <header className={css({ mb: '8' })}>
        <h1 className={css({ textStyle: 'heading1', mb: '6' })}>
          Design System
        </h1>
        <SubpageNav />
      </header>
      <Outlet />
    </Container>
  );
}
