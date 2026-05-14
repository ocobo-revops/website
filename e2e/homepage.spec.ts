import { expect, test } from '@playwright/test';

test.describe('homepage golden path', () => {
  test('loads with Ocobo in the document title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ocobo/);
  });

  test('hero heading is visible', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /architecture/i }).first(),
    ).toBeVisible();
  });

  test('primary CTA is visible and links to contact', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByTestId('hero-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/contact/);
  });
});

test.describe('contact page', () => {
  test('nav CTA navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-cta').click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('contact heading is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByTestId('contact-heading')).toBeVisible();
  });

  test('form card heading is visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByTestId('form-card-heading')).toBeVisible();
  });

  test('HubSpot form container is present in DOM', async ({ page }) => {
    await page.goto('/contact');
    // The .hbspt-form div is rendered server-side; HubSpot JS populates it
    // asynchronously. Submission testing requires a live HubSpot portal
    // and is excluded from automated E2E.
    await expect(page.locator('.hbspt-form')).toBeAttached();
  });
});

test.describe('english locale smoke test', () => {
  test('/en/ loads with Ocobo in the document title', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/Ocobo/);
  });

  test('/en/ hero heading is visible', async ({ page }) => {
    await page.goto('/en/');
    await expect(
      page.getByRole('heading', { name: /architecture/i }).first(),
    ).toBeVisible();
  });
});
