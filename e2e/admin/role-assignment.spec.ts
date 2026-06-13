import { test, expect } from '@playwright/test';

/**
 * Admin role-assignment flow — unauthenticated probe.
 *
 * Admin is bootstrapped manually via the database; there's no public way
 * to become one. This spec verifies the route is properly gated. The
 * actual role-grant interaction is skipped until a seeded admin user
 * with known credentials is configured in CI.
 */
test.describe('admin panel', () => {
  test('unauthenticated /admin route redirects to auth', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL(/\/auth/, { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test.skip('admin can grant instructor role to a user', async () => {
    // TODO: enable once a seeded admin user exists in CI.
    // Flow: login as admin → /admin → user manager → search target user →
    // toggle instructor role → verify success toast + badge update.
  });
});
