import type { MetaFunction } from 'react-router';
import { Outlet, useLocation } from 'react-router';

import { css, cx } from '@ocobo/styled-system/css';
import { text } from '@ocobo/styled-system/recipes';

import { DesignSystemSidebar } from '~/components/design-system/design-system-sidebar';
import { OnThisPage } from '~/components/design-system/on-this-page';
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

// One column on small screens (sidebar above the content), sidebar and
// content from `lg`, and the "On this page" list on the right from `xl`.
const layout = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'minmax(0, 1fr)',
    lg: '13rem minmax(0, 1fr)',
    xl: '13rem minmax(0, 1fr) 12rem',
  },
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
// The index has no section list, so its content also takes the right column.
const fullWidthMain = css({ xl: { gridColumn: 'span 2' } });
const onThisPageColumn = cx(
  sticky,
  css({ display: { base: 'none', xl: 'block' } }),
);
const eyebrow = cx(text({ variant: 'label' }), css({ color: 'gray', mb: '2' }));

// Each showcase section lives in its own module under
// `app/components/design-system/`. To add one:
// 1. Create the module there, wrapped in `ShowcaseSection`.
// 2. Pick its page in `designSystemGroups` (`subpages.ts`) and add its title
//    to that page's `sections`, which feed the "On this page" list.
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
      <main className={current ? undefined : fullWidthMain}>
        <header className={css({ mb: '8' })}>
          {current ? <p className={eyebrow}>{current.group.title}</p> : null}
          <h1 className={css({ textStyle: 'heading1' })}>
            {current ? current.page.title : 'Design System'}
          </h1>
        </header>
        <Outlet />
      </main>
      {current ? (
        <div className={onThisPageColumn}>
          <OnThisPage sections={current.page.sections} />
        </div>
      ) : null}
    </Container>
  );
}
