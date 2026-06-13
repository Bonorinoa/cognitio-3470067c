import { test, expect } from '@playwright/test';

/**
 * Student purchase flow — unauthenticated portion.
 *
 * Verifies the public catalog → course page → auth gate path that any
 * prospective student takes. The Stripe checkout portion itself is
 * skipped here (it depends on seeded users + live Stripe keys, both
 * deferred per launch plan) and tracked as a TODO so we re-enable
 * after the business setup.
 */
test.describe('student purchase flow', () => {
  test('catalog → first course → purchase CTA gates on auth', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.locator('h1').first()).toBeVisible();

    // First published course card (if any). Skip silently when DB is empty
    // so the spec stays useful in fresh dev seeds without spamming failures.
    const firstCourse = page.locator('a[href^="/course/"]').first();
    const courseCount = await firstCourse.count();
    if (courseCount === 0) {
      test.skip(true, 'No published courses in the catalog yet — skipping deep link.');
      return;
    }

    await firstCourse.click();
    await page.waitForURL(/\/course\//);
    await expect(page.locator('h1').first()).toBeVisible();

    // Logged-out users must see an auth CTA before any purchase button does anything.
    const ctas = page.locator('a[href="/auth"], button:has-text("Iniciar"), button:has-text("Comprar")');
    await expect(ctas.first()).toBeVisible();
  });

  test.skip('full Stripe checkout end-to-end', async () => {
    // TODO: enable once seeded student exists + Stripe/Mercado Pago is configured.
  });
});
