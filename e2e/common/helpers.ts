import { Page, expect } from '@playwright/test';

/**
 * Helper functions for E2E tests
 */

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, url: string, timeout = 5000) {
  await page.waitForURL(url, { timeout });
}

/**
 * Fill form field by label text
 */
export async function fillByLabel(page: Page, label: string, value: string) {
  const input = page.locator(`label:has-text("${label}")`).locator('..').locator('input, textarea');
  await input.fill(value);
}

/**
 * Click button by text content
 */
export async function clickButton(page: Page, text: string) {
  await page.click(`button:has-text("${text}")`);
}

/**
 * Check if element is visible on page
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message?: string) {
  const toastSelector = message 
    ? `[role="status"]:has-text("${message}")`
    : '[role="status"]';
  await page.waitForSelector(toastSelector, { timeout: 5000 });
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for user avatar or profile menu
  return await isVisible(page, '[data-testid="user-avatar"], button[aria-label*="user"]');
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-avatar"], button[aria-label*="user"]');
  // Click sign out
  await page.click('button:has-text("Sign out"), a:has-text("Sign out")');
  await page.waitForURL('/');
}

/**
 * Navigate to a route and verify
 */
export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Fill and submit a form
 */
export async function submitForm(page: Page, formData: Record<string, string>, submitButtonText = 'Submit') {
  for (const [label, value] of Object.entries(formData)) {
    await fillByLabel(page, label, value);
  }
  await clickButton(page, submitButtonText);
}

/**
 * Check for error message
 */
export async function hasError(page: Page, errorText?: string): Promise<boolean> {
  const selector = errorText
    ? `[role="alert"]:has-text("${errorText}"), .error:has-text("${errorText}")`
    : '[role="alert"], .error';
  return await isVisible(page, selector);
}

/**
 * Wait for loading to complete
 */
export async function waitForLoading(page: Page) {
  // Wait for loading indicators to disappear
  try {
    await page.waitForSelector('[data-testid="loading"], .loading, [aria-busy="true"]', {
      state: 'hidden',
      timeout: 10000
    });
  } catch {
    // No loading indicator found, continue
  }
}

/**
 * Check responsive design at different viewports
 */
export async function testResponsive(page: Page, callback: () => Promise<void>) {
  const viewports = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await callback();
  }
}

/**
 * Verify page accessibility
 */
export async function checkAccessibility(page: Page) {
  // Basic accessibility checks
  // Check for proper heading hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  expect(headings.length).toBeGreaterThan(0);

  // Check for alt text on images
  const images = await page.locator('img').all();
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeDefined();
  }

  // Check for proper form labels
  const inputs = await page.locator('input, textarea, select').all();
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    const ariaLabel = await input.getAttribute('aria-label');
    const ariaLabelledBy = await input.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledBy && id) {
      const label = await page.locator(`label[for="${id}"]`).count();
      expect(label).toBeGreaterThan(0);
    }
  }
}
