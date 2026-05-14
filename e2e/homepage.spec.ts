import { expect, test } from '@playwright/test';

test.describe('homepage golden path', () => {
  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ocobo/);
  });

  test('hero heading is visible', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /architecture/i }).first(),
    ).toBeVisible();
  });

  test('primary CTA is visible', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: /rencontrer un architecte/i }),
    ).toBeVisible();
  });
});

test.describe('contact page', () => {
  test('nav CTA navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /prendre rdv/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('contact heading is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(
      page.getByRole('heading', { name: /parlez à un architecte/i }),
    ).toBeVisible();
  });

  test('form card heading is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(
      page.getByRole('heading', { name: /dites-nous en plus/i }),
    ).toBeVisible();
  });

  test('HubSpot form container is present in DOM', async ({ page }) => {
    await page.goto('/contact');
    // The .hbspt-form div is always rendered; HubSpot JS populates it
    // asynchronously. Submission testing requires a live HubSpot portal
    // and is excluded from automated E2E.
    await expect(page.locator('.hbspt-form')).toBeAttached();
  });
});
