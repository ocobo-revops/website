import { expect, test } from '@playwright/test';

// Section headings per subpage, in page order. Each section must show on its
// own subpage once and on no other.
const subpages = [
  {
    path: '/design-system/foundations',
    name: 'Foundations',
    sections: [
      'Type scale (v2)',
      'Greys and line',
      'Challenge colours',
      'AI gradients',
      'Radii',
      'Shadows',
      'Font sizes and letter spacings',
      'Easing',
      'css',
      'Colors',
      'Borders',
      'Icons',
      'Logo',
      'Illustrations',
      'Grid',
    ],
  },
  {
    path: '/design-system/components',
    name: 'Components',
    sections: [
      'Buttons',
      'Button: secondary and link',
      'Badge: ai variant and xs size',
      'Eyebrow',
      'Form',
      'MetaPill',
      'Card recipe',
      'Flip card',
      'Person card',
      'Tooltip',
      'Tabs',
    ],
  },
  {
    path: '/design-system/patterns',
    name: 'Patterns',
    sections: ['Navbar and footer (v2)', 'Bow tie', 'Motion'],
  },
];

const allSections = subpages.flatMap(({ sections }) => sections);

test.describe('design system subpages', () => {
  test('the index links to each subpage', async ({ page }) => {
    await page.goto('/design-system');
    for (const { path, name } of subpages) {
      const heading = page.getByRole('heading', { level: 2, name, exact: true });
      await expect(heading).toBeVisible();
      await expect(heading.getByRole('link', { name })).toHaveAttribute(
        'href',
        path,
      );
    }
  });

  for (const { path, name, sections } of subpages) {
    test(`${name} renders its own sections only`, async ({ page }) => {
      await page.goto(path);
      for (const section of allSections) {
        await expect(
          page.getByRole('heading', { level: 2, name: section, exact: true }),
        ).toHaveCount(sections.includes(section) ? 1 : 0);
      }
    });

    test(`${name} is marked as the current subpage`, async ({ page }) => {
      await page.goto(path);
      const nav = page.getByRole('navigation', { name: 'Design system' });
      await expect(nav.getByRole('link', { name, exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    });
  }

  test('the navigation works with a keyboard', async ({ page }) => {
    await page.goto('/design-system');
    const nav = page.getByRole('navigation', { name: 'Design system' });
    await nav.getByRole('link', { name: 'Overview', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(
      nav.getByRole('link', { name: 'Foundations', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/design-system\/components$/);
    await expect(
      nav.getByRole('link', { name: 'Components', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });
});
