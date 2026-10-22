import { expect, test } from '@playwright/test';

// CI runs on the local content source, which holds no challenge file: these
// checks cover the routing only. `playwright.config.ts` turns the
// `challenges` page on for them. A dev server already running locally is
// reused without that setting: the redirect test then gets a 404. The page itself is checked on a preview with
// `GITHUB_BRANCH` set to a posts branch that holds a challenge.
test.describe('challenge page routing', () => {
  test('a missing challenge returns 404', async ({ page }) => {
    const response = await page.goto('/fr/challenges/does-not-exist');
    expect(response?.status()).toBe(404);
  });

  test('a slug outside kebab-case returns 404', async ({ page }) => {
    const response = await page.goto('/en/challenges/Not_A_Slug');
    expect(response?.status()).toBe(404);
  });

  test('the unprefixed URL redirects to the French one', async ({ page }) => {
    await page.goto('/challenges/does-not-exist');
    await expect(page).toHaveURL(/\/fr\/challenges\/does-not-exist$/);
  });
});
