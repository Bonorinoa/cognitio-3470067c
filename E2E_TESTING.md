# E2E Testing Guide

## Overview

This document provides comprehensive guidance for End-to-End (E2E) testing in the Cognitio platform using Playwright.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Test Data](#test-data)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## Setup

### Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)

### Installation

Playwright is already configured in this project. If you need to reinstall:

```bash
npm install -D @playwright/test playwright
npx playwright install chromium
```

## Running Tests

### Available Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all

# Run specific test file
npx playwright test e2e/auth/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in debug mode
npx playwright test --debug
```

### Test Execution Modes

- **Headless (default)**: Tests run without visible browser
- **Headed**: Tests run with visible browser (`--headed`)
- **UI Mode**: Interactive test runner with time-travel debugging (`--ui`)
- **Debug Mode**: Step-by-step test execution (`--debug`)

## Test Structure

### Directory Organization

```
e2e/
├── auth/                   # Authentication tests
│   └── auth.spec.ts
├── student/                # Student journey tests
│   └── student-journey.spec.ts
├── instructor/             # Instructor journey tests
│   └── instructor-journey.spec.ts
├── admin/                  # Admin panel tests
│   └── admin-panel.spec.ts
└── common/                 # Shared utilities
    ├── fixtures.ts         # Test data and fixtures
    ├── helpers.ts          # Helper functions
    └── navigation.spec.ts  # Navigation tests
```

### Test Suites

#### 1. Authentication Tests (`e2e/auth/auth.spec.ts`)
- Login flow
- Signup flow
- Password reset
- Session persistence
- Form validation

#### 2. Student Journey Tests (`e2e/student/student-journey.spec.ts`)
- Course discovery and browsing
- Course search and filtering
- Course detail viewing
- Video player functionality
- Progress tracking
- Dashboard access
- Responsive design

#### 3. Instructor Journey Tests (`e2e/instructor/instructor-journey.spec.ts`)
- Instructor dashboard
- Course creation
- Course editing
- Chapter management
- Video uploads (Mux integration)
- Analytics viewing
- Profile management
- Consultation services

#### 4. Admin Tests (`e2e/admin/admin-panel.spec.ts`)
- Admin panel access
- User role management
- Platform oversight
- Course moderation

#### 5. Navigation Tests (`e2e/common/navigation.spec.ts`)
- Main navigation
- Mobile navigation
- Breadcrumbs
- Route protection
- 404 handling
- Legacy route redirects

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { takeScreenshot, waitForLoading } from '../common/helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should perform action', async ({ page }) => {
    // Arrange
    await page.goto('/specific-page');
    
    // Act
    await page.click('button:has-text("Click Me")');
    
    // Assert
    await expect(page).toHaveURL('/expected-url');
    
    // Optional: Take screenshot
    await takeScreenshot(page, 'test-name');
  });
});
```

### Using Fixtures

Fixtures provide reusable test data and authenticated contexts:

```typescript
import { test, TEST_USERS, TEST_COURSE } from '../common/fixtures';

test('should use test data', async ({ page }) => {
  // Use predefined test users
  await page.fill('input[type="email"]', TEST_USERS.student.email);
  
  // Use test course data
  await page.fill('input[name="title"]', TEST_COURSE.title);
});

// Use authenticated context
test('should access protected page', async ({ authenticatedStudent }) => {
  // This test starts with user already logged in
  await authenticatedStudent.goto('/dashboard');
});
```

### Using Helper Functions

```typescript
import { 
  waitForNavigation,
  fillByLabel,
  clickButton,
  waitForToast,
  isVisible,
  logout
} from '../common/helpers';

test('should use helpers', async ({ page }) => {
  await page.goto('/auth');
  
  // Fill form by label
  await fillByLabel(page, 'Email', 'user@example.com');
  await fillByLabel(page, 'Password', 'password123');
  
  // Click button by text
  await clickButton(page, 'Sign In');
  
  // Wait for success toast
  await waitForToast(page, 'Login successful');
  
  // Check visibility
  const isLoggedIn = await isVisible(page, '[data-testid="user-avatar"]');
  expect(isLoggedIn).toBeTruthy();
});
```

## Test Data

### Test Users

Predefined test users for different roles:

```typescript
TEST_USERS = {
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
}
```

**Note**: These users must be created in your test database for authentication tests to pass.

### Test Course Data

```typescript
TEST_COURSE = {
  title: 'Introduction to Web Development',
  description: 'Learn web development fundamentals',
  price: 49.99,
  category: 'Technology',
  chapters: [...]
}
```

## Best Practices

### 1. Test Independence
- Each test should be independent
- Don't rely on test execution order
- Clean up after tests if needed

```typescript
test.afterEach(async ({ page }) => {
  // Cleanup if needed
  await page.close();
});
```

### 2. Use Proper Selectors

```typescript
// ✅ Good: Semantic selectors
await page.click('button[type="submit"]');
await page.locator('text=Sign In').click();
await page.getByRole('button', { name: 'Submit' }).click();

// ❌ Avoid: Brittle selectors
await page.click('.btn-primary-123');
await page.click('div > div > button');
```

### 3. Wait for Actions

```typescript
// Wait for navigation
await page.click('a[href="/courses"]');
await page.waitForURL('/courses');

// Wait for element
await page.waitForSelector('[data-testid="course-card"]');

// Wait for network idle
await page.goto('/', { waitUntil: 'networkidle' });
```

### 4. Take Screenshots

Take screenshots for documentation and debugging:

```typescript
// Automatically named with timestamp
await takeScreenshot(page, 'feature-description');

// Or use Playwright directly
await page.screenshot({ 
  path: 'screenshot.png',
  fullPage: true 
});
```

### 5. Test Accessibility

```typescript
import { checkAccessibility } from '../common/helpers';

test('should be accessible', async ({ page }) => {
  await page.goto('/');
  await checkAccessibility(page);
});
```

### 6. Test Responsive Design

```typescript
import { testResponsive } from '../common/helpers';

test('should work on all viewports', async ({ page }) => {
  await testResponsive(page, async () => {
    await page.goto('/courses');
    // Test will run on desktop, tablet, and mobile
  });
});
```

## Troubleshooting

### Common Issues

#### 1. Tests Timeout

```typescript
// Increase timeout for slow operations
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  
  await page.goto('/slow-page');
});
```

#### 2. Element Not Found

```typescript
// Wait for element before interacting
await page.waitForSelector('button:has-text("Submit")', {
  state: 'visible',
  timeout: 10000
});
await page.click('button:has-text("Submit")');
```

#### 3. Flaky Tests

```typescript
// Add retry logic
test.describe.configure({ retries: 2 });

test('potentially flaky', async ({ page }) => {
  // Test code
});
```

#### 4. Authentication Issues

```typescript
// Verify test users exist in database
// Check .env configuration
// Ensure Supabase connection is active
```

### Debug Mode

Run tests in debug mode to step through:

```bash
npx playwright test --debug
npx playwright test auth.spec.ts --debug
```

### Trace Viewer

View detailed traces of test execution:

```bash
# Traces are captured on first retry
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables

Set these in your CI environment:

```bash
BASE_URL=http://localhost:5173
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

## Test Coverage

### Current E2E Test Coverage

- ✅ Authentication flows (login, signup, password reset)
- ✅ Public navigation and browsing
- ✅ Course discovery and search
- ✅ Responsive design testing
- ✅ Route protection
- ✅ Navigation patterns
- ⚠️ Protected routes (requires test data setup)
- ⚠️ Payment flows (requires Stripe test mode)
- ⚠️ Video playback (requires Mux integration)
- ⚠️ Role-based access control (requires test users)

### Extending Tests

To add new tests:

1. Create a new spec file in appropriate directory
2. Import fixtures and helpers
3. Write test scenarios
4. Document expected behavior
5. Run and verify tests
6. Update this documentation

## Screenshots

Test screenshots are saved to:
```
test-results/screenshots/
```

View them after test execution to verify UI appearance.

## Reports

HTML reports are generated after each test run:

```bash
npm run test:e2e:report
```

This opens an interactive report showing:
- Test results
- Execution times
- Screenshots
- Videos (on failure)
- Traces

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Testing Library Philosophy](https://testing-library.com/docs/guiding-principles)

## Contributing

When adding new E2E tests:

1. Follow the existing structure
2. Use fixtures and helpers when possible
3. Add meaningful descriptions
4. Document any setup requirements
5. Ensure tests are independent
6. Update this documentation

---

*Last Updated: December 2024*
*Version: 1.0.0*
