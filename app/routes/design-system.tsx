import type { MetaFunction } from 'react-router';
import { Outlet, useLocation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { DesignSystemSidebar } from '~/components/design-system/design-system-sidebar';
import {
  designSystemDescription,
  findDesignSystemPage,
} from '~/components/design-system/subpages';
import { Container } from '~/components/ui/Container';
import { getMetaTags } from '~/utils/metatags';

export const meta: MetaFunction = () => {
  return getMetaTags({
    title: 'design system',
    description: designSystemDescription,
    locale: 'fr',
  });
};

// One column on small screens (sidebar above the content), then one sidebar
// beside the content from `lg`. The sidebar also holds the current page's
// section links, so the content keeps the rest of the width.
const layout = css({
  display: 'grid',
  gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '13rem minmax(0, 1fr)' },
  columnGap: '10',
  rowGap: '8',
  py: '8',
});
const sticky = css({
  lg: {
    position: 'sticky',
    top: '8',
    alignSelf: 'start',
    maxH: '[calc(100vh - 4rem)]',
    overflowY: 'auto',
  },
});
const eyebrow = cx(text({ variant: 'label' }), css({ color: 'gray', mb: '2' }));

// Each showcase section lives in its own module under
// `app/components/design-system/`. To add one:
// 1. Create the module there, wrapped in `ShowcaseSection`.
// 2. Pick its page in `designSystemGroups` (`subpages.ts`) and add its title
//    to that page's `sections`, which feed the section links under its
//    sidebar entry.
// 3. Compose it in that page's route, `design-system.<slug>.tsx`.
// A new page is a new registry entry plus a new route file.
export default function DesignSystemLayout() {
  const { pathname } = useLocation();
  const current = findDesignSystemPage(pathname);

  return (
    <Container className={layout}>
      <div className={sticky}>
        <DesignSystemSidebar />
      </div>
      <main>
        <header className={css({ mb: '8' })}>
          {current ? <p className={eyebrow}>{current.group.title}</p> : null}
          <h1 className={css({ textStyle: 'heading1' })}>
            {current ? current.page.title : 'Design System'}
          </h1>
        </header>
        <Outlet />
      </main>
    </Container>
  );
}
