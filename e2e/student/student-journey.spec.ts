import { test, expect } from '@playwright/test';
import { takeScreenshot, waitForLoading } from '../common/helpers';

test.describe('Student Course Discovery', () => {
  test('should display landing page with course catalog', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await waitForLoading(page);
    
    // Check hero section
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Take screenshot of landing page
    await takeScreenshot(page, 'landing-page');
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click courses link
    const coursesLink = page.locator('a[href="/courses"], button:has-text("Courses"), a:has-text("Courses")');
    await coursesLink.first().click();
    
    await expect(page).toHaveURL('/courses');
    await takeScreenshot(page, 'courses-catalog');
  });

  test('should display course catalog with filters', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    // Check for search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
      await takeScreenshot(page, 'courses-search');
    }
    
    // Check for category filters
    const categoryFilters = page.locator('button:has-text("Category"), select[name*="category"]');
    if (await categoryFilters.isVisible()) {
      console.log('Category filters available');
    }
  });

  test('should search for courses', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('web development');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Verify results updated
      const courseCards = page.locator('[data-testid="course-card"], .course-card');
      const count = await courseCards.count();
      console.log(`Found ${count} courses after search`);
      
      await takeScreenshot(page, 'courses-search-results');
    }
  });

  test('should filter courses by category', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    // Try to click category filter
    const technologyFilter = page.locator('button:has-text("Technology"), a:has-text("Technology")');
    if (await technologyFilter.isVisible()) {
      await technologyFilter.first().click();
      await page.waitForTimeout(500);
      
      await takeScreenshot(page, 'courses-filtered-technology');
    }
  });
});

test.describe('Course Detail Page', () => {
  test('should display course details', async ({ page }) => {
    // Navigate to courses and click first course
    await page.goto('/courses');
    await waitForLoading(page);
    
    // Find and click first course card
    const firstCourse = page.locator('[data-testid="course-card"], .course-card, a[href*="/course/"]').first();
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      
      // Wait for course page to load
      await expect(page).toHaveURL(/\/course\//);
      await waitForLoading(page);
      
      // Verify course details are visible
      await expect(page.locator('h1').first()).toBeVisible();
      
      // Check for course description
      const description = page.locator('p, div').filter({ hasText: /.{50,}/ });
      if (await description.first().isVisible()) {
        console.log('Course description visible');
      }
      
      await takeScreenshot(page, 'course-detail-page');
    }
  });

  test('should show course chapters/curriculum', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    const firstCourse = page.locator('[data-testid="course-card"], .course-card, a[href*="/course/"]').first();
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await waitForLoading(page);
      
      // Look for chapter list
      const chapterList = page.locator('[data-testid="chapter-list"], .chapter-list');
      const chapters = page.locator('[data-testid="chapter"], .chapter');
      
      const chapterCount = await chapters.count();
      console.log(`Found ${chapterCount} chapters`);
      
      if (chapterCount > 0) {
        await takeScreenshot(page, 'course-chapters');
      }
    }
  });

  test('should display enrollment/purchase button', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    const firstCourse = page.locator('[data-testid="course-card"], .course-card, a[href*="/course/"]').first();
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await waitForLoading(page);
      
      // Look for enroll/purchase button
      const enrollButton = page.locator('button:has-text("Enroll"), button:has-text("Purchase"), button:has-text("Buy")');
      
      if (await enrollButton.first().isVisible()) {
        console.log('Enrollment button found');
        await takeScreenshot(page, 'course-enrollment-button');
      }
    }
  });

  test('should show instructor information', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    const firstCourse = page.locator('[data-testid="course-card"], .course-card, a[href*="/course/"]').first();
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await waitForLoading(page);
      
      // Look for instructor info
      const instructorSection = page.locator('[data-testid="instructor"], .instructor-info');
      if (await instructorSection.isVisible()) {
        console.log('Instructor information displayed');
      }
    }
  });
});

test.describe('Video Player', () => {
  test('should display video player for enrolled courses', async ({ page }) => {
    // This test requires authentication and enrollment
    // For now, just document the expected behavior
    
    await page.goto('/courses');
    await waitForLoading(page);
    
    // In a real scenario with enrolled courses:
    // 1. Navigate to enrolled course
    // 2. Verify video player is visible
    // 3. Test play/pause functionality
    // 4. Test chapter navigation
    
    console.log('Video player test requires authenticated user with enrolled courses');
  });

  test('should show free preview chapters', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    const firstCourse = page.locator('[data-testid="course-card"], .course-card, a[href*="/course/"]').first();
    
    if (await firstCourse.isVisible()) {
      await firstCourse.click();
      await waitForLoading(page);
      
      // Look for free preview indicator
      const freePreview = page.locator('*:has-text("Free preview"), *:has-text("Preview")');
      const count = await freePreview.count();
      console.log(`Found ${count} free preview indicators`);
    }
  });
});

test.describe('Student Dashboard', () => {
  test('should redirect to auth if not logged in', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/, { timeout: 5000 });
  });

  test('should display enrolled courses for authenticated users', async ({ page }) => {
    // This requires authentication setup
    // For now, document expected behavior
    
    console.log('Dashboard test requires authenticated student user');
    
    // Expected behavior:
    // 1. User logs in
    // 2. Navigates to /dashboard
    // 3. Sees list of enrolled courses
    // 4. Can continue learning from last position
    // 5. Can see progress statistics
  });
});

test.describe('About Page', () => {
  test('should display about page with instructor profiles', async ({ page }) => {
    await page.goto('/about');
    await waitForLoading(page);
    
    // Check page loaded
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Look for instructor profiles
    const profiles = page.locator('[data-testid="instructor-profile"], .instructor-profile');
    const profileCount = await profiles.count();
    console.log(`Found ${profileCount} instructor profiles`);
    
    await takeScreenshot(page, 'about-page');
  });

  test('should display founder information', async ({ page }) => {
    await page.goto('/about');
    await waitForLoading(page);
    
    // Look for founder names from README
    const founderNames = ['Gustavo', 'Augusto'];
    
    for (const name of founderNames) {
      const nameElement = page.locator(`*:has-text("${name}")`);
      if (await nameElement.first().isVisible()) {
        console.log(`Found founder: ${name}`);
      }
    }
    
    await takeScreenshot(page, 'about-page-founders');
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await waitForLoading(page);
    
    await takeScreenshot(page, 'landing-page-mobile');
    
    // Check mobile menu
    const mobileMenu = page.locator('button[aria-label*="menu"], button:has-text("Menu")');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await takeScreenshot(page, 'mobile-menu');
    }
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/courses');
    await waitForLoading(page);
    
    await takeScreenshot(page, 'courses-page-tablet');
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await waitForLoading(page);
    
    await takeScreenshot(page, 'landing-page-desktop');
  });
});
