import { test, expect } from '@playwright/test';

/**
 * Instructor create-course flow — unauthenticated probe.
 *
 * The instructor surface is invite-only and not creatable from the public
 * UI, so this spec verifies the gate works correctly: hitting /instructor
 * without a session should redirect through the auth flow. The full
 * create-course path is skipped until a seeded instructor exists in CI.
 */
test.describe('instructor journey', () => {
  test('unauthenticated /instructor route redirects to auth', async ({ page }) => {
    await page.goto('/instructor');
    // RequireInstructor sends unauthenticated users to /auth.
    await page.waitForURL(/\/auth/, { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test.skip('seeded instructor can create a draft course', async () => {
    // TODO: enable once a seeded instructor with known credentials lives in CI.
    // Flow: login → /instructor/create → fill basic info → save draft →
    // verify draft appears in /instructor/courses.
  });
});
