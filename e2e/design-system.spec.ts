import { type Page, expect, test } from '@playwright/test';

// The pages of issue #270, grouped, with their section headings in page
// order. Kept apart from the registry on purpose, so a registry mistake
// fails here. Each section must show on its own page once and on no other.
const groups = [
  {
    title: 'Foundations',
    pages: [
      {
        slug: 'tokens',
        name: 'Tokens',
        sections: ['Radii', 'Shadows', 'Easing', 'Borders', 'Grid'],
      },
      {
        slug: 'colours',
        name: 'Colours',
        sections: [
          'Greys and line',
          'Challenge colours',
          'AI gradients',
          'Colors',
        ],
      },
      {
        slug: 'typography',
        name: 'Typography',
        sections: ['Type scale (v2)', 'Font sizes and letter spacings', 'css'],
      },
      {
        slug: 'brand',
        name: 'Brand',
        sections: ['Logo', 'Icons', 'Illustrations'],
      },
    ],
  },
  {
    title: 'Components',
    pages: [
      {
        slug: 'actions',
        name: 'Actions',
        sections: [
          'Buttons',
          'Button: secondary and link',
          'Badge: ai variant and xs size',
          'Eyebrow',
          'MetaPill',
        ],
      },
      { slug: 'forms', name: 'Forms', sections: ['Form'] },
      {
        slug: 'cards',
        name: 'Cards',
        sections: ['Card recipe', 'Flip card', 'Person card'],
      },
      {
        slug: 'tooltip-and-tabs',
        name: 'Tooltip and tabs',
        sections: ['Tooltip', 'Tabs'],
      },
      {
        slug: 'navigation',
        name: 'Navigation',
        sections: ['Navbar and footer (v2)'],
      },
    ],
  },
  {
    title: 'Patterns',
    pages: [
      { slug: 'bow-tie', name: 'Bow tie', sections: ['Bow tie'] },
      { slug: 'motion', name: 'Motion', sections: ['Motion'] },
    ],
  },
];

const pages = groups.flatMap(({ pages }) =>
  pages.map((page) => ({ ...page, path: `/design-system/${page.slug}` })),
);
const index = {
  path: '/design-system',
  name: 'Overview',
  sections: [] as string[],
};
const allSections = pages.flatMap(({ sections }) => sections);

const sidebar = (page: Page) =>
  page.getByRole('navigation', { name: 'Design system' });

test.describe('design system pages', () => {
  test('the index links to every page, grouped', async ({ page }) => {
    await page.goto(index.path);
    for (const group of groups) {
      const section = page.locator('main section', {
        has: page.getByRole('heading', { level: 2, name: group.title }),
      });
      await expect(section.getByRole('link')).toHaveCount(group.pages.length);
      for (const { slug, name } of group.pages) {
        await expect(
          section.getByRole('link', { name, exact: true }),
        ).toHaveAttribute('href', `/design-system/${slug}`);
      }
    }
  });

  for (const { path, name, sections } of [index, ...pages]) {
    test(`${name} renders its own sections only`, async ({ page }) => {
      await page.goto(path);
      for (const section of allSections) {
        await expect(
          page.getByRole('heading', { level: 2, name: section, exact: true }),
        ).toHaveCount(sections.includes(section) ? 1 : 0);
      }
    });

    test(`${name} is marked as the current page`, async ({ page }) => {
      await page.goto(path);
      const nav = sidebar(page);
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    });
  }

  for (const { path, name } of pages) {
    test(`${name} lists every section and links to its heading`, async ({
      page,
    }) => {
      await page.goto(path);
      // The list may be hidden on narrow screens, so read it from the DOM.
      const hrefs = await page
        .locator('nav[aria-label="On this page"] a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      const headingIds = await page
        .locator('main section > h2[id]')
        .evaluateAll((headings) => headings.map((heading) => heading.id));
      expect(hrefs).toEqual(headingIds.map((id) => `#${id}`));
      for (const href of hrefs) {
        await expect(page.locator(`[id="${href?.slice(1)}"]`)).toHaveCount(1);
      }
    });
  }

  test('the index has no section list', async ({ page }) => {
    await page.goto(index.path);
    await expect(page.locator('nav[aria-label="On this page"]')).toHaveCount(0);
  });

  test('the sidebar works with a keyboard', async ({ page }) => {
    await page.goto(index.path);
    const nav = sidebar(page);
    await nav.getByRole('link', { name: 'Overview', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(
      nav.getByRole('link', { name: 'Tokens', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/design-system\/colours$/);
    await expect(
      nav.getByRole('link', { name: 'Colours', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('design system pages at 375 px', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const { path, name } of [index, ...pages]) {
    test(`${name} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
