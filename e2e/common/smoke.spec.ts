import { test, expect } from '@playwright/test';

/**
 * Smoke tests — fast, no-auth canary that the public surface boots.
 * Heavier flows live in e2e/{auth,student,instructor,admin,common}/.
 */

test.describe('smoke', () => {
  test('landing page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('courses catalog renders', async ({ page }) => {
    await page.goto('/courses');
    // The catalog page sets an H1 with either "Cursos" or "Courses"
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('ai studio landing renders', async ({ page }) => {
    await page.goto('/ai-studio');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
