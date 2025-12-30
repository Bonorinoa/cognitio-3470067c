import { test as base } from '@playwright/test';

/**
 * Test fixtures for Cognitio E2E tests
 * Provides reusable test data and helper methods
 */

// Test user credentials
export const TEST_USERS = {
  student: {
    email: 'test.student@cognitio.test',
    password: 'TestPassword123!',
    name: 'Test Student'
  },
  instructor: {
    email: 'test.instructor@cognitio.test',
    password: 'TestPassword123!',
    name: 'Test Instructor'
  },
  admin: {
    email: 'test.admin@cognitio.test',
    password: 'TestPassword123!',
    name: 'Test Admin'
  }
};

// Test course data
export const TEST_COURSE = {
  title: 'Introduction to Web Development',
  description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript',
  price: 49.99,
  category: 'Technology',
  chapters: [
    {
      title: 'Getting Started with HTML',
      description: 'Learn the basics of HTML structure and elements',
      duration: 600,
      isFreePreview: true
    },
    {
      title: 'CSS Fundamentals',
      description: 'Understanding CSS selectors, properties, and layouts',
      duration: 900,
      isFreePreview: false
    },
    {
      title: 'JavaScript Basics',
      description: 'Introduction to JavaScript programming',
      duration: 1200,
      isFreePreview: false
    }
  ]
};

// Test service data for instructors
export const TEST_SERVICE = {
  title: 'One-on-One Consultation',
  description: 'Personalized coaching session to help you achieve your learning goals',
  price: 99.99
};

/**
 * Extended test fixture with authentication helpers
 */
export const test = base.extend({
  // Auto-authenticated context for each user role
  authenticatedStudent: async ({ page }, use) => {
    // Login as student
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USERS.student.email);
    await page.fill('input[type="password"]', TEST_USERS.student.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },

  authenticatedInstructor: async ({ page }, use) => {
    // Login as instructor
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USERS.instructor.email);
    await page.fill('input[type="password"]', TEST_USERS.instructor.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/instructor');
    await use(page);
  },

  authenticatedAdmin: async ({ page }, use) => {
    // Login as admin
    await page.goto('/auth');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[type="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await use(page);
  },
});

export { expect } from '@playwright/test';
