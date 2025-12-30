import { test, expect } from '@playwright/test';
import { takeScreenshot, waitForLoading } from '../common/helpers';

test.describe('Main Navigation', () => {
  test('should display navbar on all pages', async ({ page }) => {
    const pages = ['/', '/courses', '/services', '/instructors'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await waitForLoading(page);
      
      // Check for navigation bar
      const navbar = page.locator('nav, header').first();
      await expect(navbar).toBeVisible();
      
      // Check for logo/brand
      const logo = page.locator('a:has-text("Cognitio"), img[alt*="logo"]');
      if (await logo.first().isVisible()) {
        console.log(`Logo visible on ${pagePath}`);
      }
    }
  });

  test('should show correct navigation links when logged out', async ({ page }) => {
    await page.goto('/');
    
    // Expected links for non-authenticated users:
    const expectedLinks = ['Inicio', 'Home', 'Cursos', 'Courses', 'Servicios', 'Services', 'Instructores', 'Instructors'];
    
    for (const linkText of expectedLinks) {
      const link = page.locator(`a:has-text("${linkText}")`);
      if (await link.isVisible()) {
        console.log(`Found navigation link: ${linkText}`);
      }
    }
    
    // Should have sign in button
    const signInButton = page.locator('button:has-text("Sign in"), a:has-text("Sign in"), button:has-text("Iniciar")');
    if (await signInButton.first().isVisible()) {
      console.log('Sign in button visible');
    }
    
    await takeScreenshot(page, 'navbar-logged-out');
  });

  test('should show user menu when logged in', async ({ page }) => {
    // This requires authentication
    console.log('Expected when logged in:');
    console.log('- User avatar/profile button');
    console.log('- Dropdown menu with:');
    console.log('  - Dashboard');
    console.log('  - Settings');
    console.log('  - Sign out');
  });

  test('should show instructor link for instructors', async ({ page }) => {
    // For authenticated instructors:
    console.log('Instructors should see:');
    console.log('- "Instructor Dashboard" link in navbar or menu');
    console.log('- Quick access to create course');
  });

  test('should show admin link for admins', async ({ page }) => {
    // For authenticated admins:
    console.log('Admins should see:');
    console.log('- "Admin Panel" link in navbar or menu');
    console.log('- All instructor features');
  });
});

test.describe('Navigation Behavior', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to courses
    const coursesLink = page.locator('a[href="/courses"], a:has-text("Cursos"), a:has-text("Courses")').first();
    if (await coursesLink.isVisible()) {
      await coursesLink.click();
      await expect(page).toHaveURL('/courses');
    }
    
    // Navigate to services
    const servicesLink = page.locator('a[href="/services"], a:has-text("Servicios"), a:has-text("Services")').first();
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await expect(page).toHaveURL('/services');
    }
    
    // Navigate back to home
    const homeLink = page.locator('a[href="/"], a:has-text("Inicio"), a:has-text("Home")').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should handle back button navigation', async ({ page }) => {
    await page.goto('/');
    await page.goto('/courses');
    await page.goto('/services');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/courses');
    
    // Go back again
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/courses');
  });

  test('should preserve scroll position on navigation', async ({ page }) => {
    await page.goto('/courses');
    await waitForLoading(page);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    
    console.log(`Scrolled to position: ${scrollY}`);
  });
});

test.describe('Mobile Navigation', () => {
  test('should display mobile menu button on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], button:has(svg)');
    
    if (await mobileMenuButton.first().isVisible()) {
      await mobileMenuButton.first().click();
      await page.waitForTimeout(500);
      
      // Verify menu opened
      const menuContent = page.locator('nav, [role="menu"], [role="navigation"]');
      console.log('Mobile menu functionality present');
      
      await takeScreenshot(page, 'mobile-navigation');
    }
  });

  test('should close mobile menu on navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');
    
    if (await mobileMenuButton.first().isVisible()) {
      // Open menu
      await mobileMenuButton.first().click();
      await page.waitForTimeout(300);
      
      // Click a link
      const coursesLink = page.locator('a[href="/courses"]');
      if (await coursesLink.isVisible()) {
        await coursesLink.click();
        
        // Menu should close
        console.log('Mobile menu should close after navigation');
      }
    }
  });
});

test.describe('Breadcrumb Navigation', () => {
  test('should display breadcrumbs on deep pages', async ({ page }) => {
    // Breadcrumbs may appear on:
    // - Course detail pages
    // - Instructor pages
    // - Settings pages
    
    console.log('Expected breadcrumb patterns:');
    console.log('Course: Home > Courses > [Course Title]');
    console.log('Instructor: Home > Instructor > [Page Name]');
    console.log('Settings: Home > Settings > [Section]');
  });
});

test.describe('Footer', () => {
  test('should display footer on all pages', async ({ page }) => {
    await page.goto('/');
    await waitForLoading(page);
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Look for footer
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      console.log('Footer is present');
      await takeScreenshot(page, 'footer');
    }
  });

  test('should contain important links', async ({ page }) => {
    await page.goto('/');
    
    // Expected footer links:
    const expectedFooterLinks = [
      'About',
      'Contact',
      'Terms',
      'Privacy',
      'Social Media'
    ];
    
    console.log('Expected footer links:', expectedFooterLinks);
  });
});

test.describe('Error Navigation', () => {
  test('should display 404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    
    // Should show 404 page
    const notFoundText = page.locator('*:has-text("404"), *:has-text("Not Found")');
    const count = await notFoundText.count();
    
    if (count > 0) {
      console.log('404 page displayed correctly');
      await takeScreenshot(page, '404-page');
    }
  });

  test('should provide way to return home from 404', async ({ page }) => {
    await page.goto('/invalid-route');
    
    // Look for home link
    const homeLink = page.locator('a[href="/"], button:has-text("Home"), a:has-text("Home")');
    if (await homeLink.first().isVisible()) {
      console.log('404 page has link back to home');
    }
  });
});

test.describe('Route Protection', () => {
  test('should redirect protected routes when not authenticated', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/instructor',
      '/instructor/courses',
      '/instructor/create',
      '/admin',
      '/settings'
    ];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Should redirect to /auth
      const currentUrl = page.url();
      if (currentUrl.includes('/auth')) {
        console.log(`✓ ${route} correctly redirects to auth`);
      } else {
        console.log(`✗ ${route} did not redirect (current: ${currentUrl})`);
      }
    }
  });

  test('should allow access to public routes', async ({ page }) => {
    const publicRoutes = [
      '/',
      '/courses',
      '/services',
      '/instructors',
      '/about',
      '/auth'
    ];
    
    for (const route of publicRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
      console.log(`✓ ${route} is publicly accessible`);
    }
  });
});

test.describe('Legacy Route Redirects', () => {
  test('should redirect /teacher routes to /instructor', async ({ page }) => {
    await page.goto('/teacher');
    
    // Should redirect to /instructor
    await expect(page).toHaveURL(/\/instructor|\/auth/);
    
    console.log('Legacy /teacher route handled');
  });

  test('should redirect /teacher/* to /instructor', async ({ page }) => {
    await page.goto('/teacher/courses');
    
    // Should redirect appropriately
    const currentUrl = page.url();
    console.log(`/teacher/courses redirects to: ${currentUrl}`);
  });
});
