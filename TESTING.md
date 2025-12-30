# Testing Documentation

## Overview
This document provides comprehensive information about the testing infrastructure, practices, and guidelines for the Cognitio Learning platform.

## Testing Frameworks

### Unit & Integration Testing
- **Vitest 4.0.16** - Fast, Vite-native test runner
- **@testing-library/react 16.3.1** - React component testing utilities
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **@testing-library/jest-dom 6.9.1** - Custom DOM matchers
- **MSW (Mock Service Worker) 2.12.4** - API request mocking
- **jsdom 27.3.0** - DOM implementation for Node.js

### End-to-End Testing
- **Playwright** - Browser automation for E2E tests
- **Chromium** - Primary browser for E2E testing
- See [E2E_TESTING.md](./E2E_TESTING.md) for complete E2E documentation

## Test Configuration

### Vitest Configuration
Located in `vitest.config.ts`:

```typescript
{
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  }
}
```

### Test Setup
The `src/test/setup.ts` file configures:
- Jest-DOM matchers for extended assertions
- MSW server for API mocking
- Cleanup after each test
- Mock implementations for browser APIs (window.matchMedia, ResizeObserver)

## Running Tests

### Unit & Integration Tests

```bash
# Run all unit tests once
npx vitest run

# Run tests in watch mode
npx vitest

# Run tests with coverage
npx vitest run --coverage

# Run specific test file
npx vitest run src/components/CourseCard.test.tsx

# Run tests matching a pattern
npx vitest run -t "renders course title"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests with visible browser
npm run test:e2e:headed

# View E2E test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

For detailed E2E testing documentation, see [E2E_TESTING.md](./E2E_TESTING.md).

## Test Structure

### Test Organization
Tests are co-located with their source files:
```
src/
├── components/
│   ├── CourseCard.tsx
│   ├── CourseCard.test.tsx
│   ├── Navbar.tsx
│   └── Navbar.test.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Dashboard.test.tsx
│   ├── TeacherDashboard.tsx
│   └── TeacherDashboard.test.tsx
└── test/
    ├── setup.ts
    ├── utils.tsx
    └── mocks/
        ├── server.ts
        └── handlers.ts
```

### Test Utilities
Located in `src/test/utils.tsx`, provides:
- Custom `render` function with all necessary providers
- Re-exports of testing-library utilities
- Test query client configuration

```typescript
import { render, screen, waitFor, userEvent } from '@/test/utils';
```

## Existing Test Coverage

### Current Test Files (6 files, 47 tests)

#### Component Tests
1. **CourseCard.test.tsx** (8 tests) ✅
   - Renders course title and description
   - Displays price and enrollment button
   - Shows progress for enrolled courses
   - Displays chapter count and duration
   - Shows category badge
   - Links to correct course page
   - Displays course image

2. **ChapterList.test.tsx** (7 tests) ✅
   - Renders all chapters
   - Shows free preview badges
   - Handles locked/unlocked states
   - Chapter selection functionality
   - Highlights current chapter
   - Displays chapter durations

3. **Navbar.test.tsx** (7 tests) ✅
   - Renders logo and branding
   - Shows sign-in button when logged out
   - Shows loading state
   - Shows user avatar when logged in
   - Navigation links
   - Conditional "My Learning" link

#### Page Tests
4. **Dashboard.test.tsx** (6 tests - 4 passing, 2 failing)
   - ✅ Redirects to auth when not logged in
   - ❌ Shows loading state (timeout issue)
   - ✅ Renders welcome message
   - ❌ Shows empty state (timeout issue)
   - ✅ Shows stats cards
   - ✅ Has search input

5. **TeacherDashboard.test.tsx** (9 tests - 5 passing, 4 failing)
   - ✅ Renders teacher dashboard
   - ❌ Shows Create Course button (timeout issue)
   - ✅ Shows stats cards
   - ✅ Shows Your Courses section
   - ✅ Shows Recent Enrollments section
   - ❌ Shows loading state (timeout issue)
   - ❌ Shows empty state for no courses (timeout issue)
   - ❌ Shows empty enrollments message (timeout issue)
   - ✅ Has View All link

6. **CreateCourse.test.tsx** (10 tests) ✅
   - Renders create course form
   - Has title input field
   - Has description textarea
   - Has price input
   - Has Save Draft and Publish buttons
   - Has Add Chapter button
   - Allows adding chapters
   - Back button navigation
   - Has category selector
   - Has image upload section

### Test Results Summary
- **Total Tests**: 47
- **Passing**: 41 (87%)
- **Failing**: 6 (13%)
- **Test Files**: 6
- **Pass Rate**: 87%

## Mock Service Worker (MSW)

### Mock API Handlers
Located in `src/test/mocks/handlers.ts`, provides mock responses for:

#### Authentication Endpoints
- `POST /auth/v1/token` - User authentication
- `GET /auth/v1/user` - Get current user

#### Database Endpoints
- `GET /rest/v1/courses` - Fetch courses
- `POST /rest/v1/courses` - Create course
- `GET /rest/v1/chapters` - Fetch chapters
- `POST /rest/v1/chapters` - Create chapters
- `GET /rest/v1/purchases` - Fetch purchases
- `GET /rest/v1/user_progress` - Fetch user progress
- `GET /rest/v1/profiles` - Fetch profiles

### Mock Data
Pre-defined mock data includes:
- Sample users and sessions
- Test courses with metadata
- Chapter data with videos
- Purchase records
- User progress data

## Writing Tests

### Test Best Practices

#### 1. Test Structure
Use the Arrange-Act-Assert pattern:

```typescript
it('renders course title', () => {
  // Arrange
  const props = { title: 'Test Course', /* ... */ };
  
  // Act
  render(<CourseCard {...props} />);
  
  // Assert
  expect(screen.getByText('Test Course')).toBeInTheDocument();
});
```

#### 2. User-Centric Queries
Prefer queries in this order:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - Inputs
4. `getByText` - Text content
5. `getByTestId` - Last resort

```typescript
// Good
screen.getByRole('button', { name: /enroll now/i });

// Better than
screen.getByTestId('enroll-button');
```

#### 3. Async Testing
Use `waitFor` for async operations:

```typescript
it('loads and displays courses', async () => {
  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Web Development')).toBeInTheDocument();
  });
});
```

#### 4. User Interactions
Use `userEvent` for realistic interactions:

```typescript
import { render, screen, userEvent } from '@/test/utils';

it('allows form submission', async () => {
  render(<CreateCourse />);
  const user = userEvent.setup();
  
  await user.type(screen.getByLabelText(/title/i), 'New Course');
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
  });
});
```

#### 5. Mocking Context
Mock authentication and other contexts:

```typescript
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// In test
vi.mocked(AuthContext.useAuth).mockReturnValue({
  user: mockUser,
  session: mockSession,
  isLoading: false,
  signOut: vi.fn(),
});
```

### Component Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '@/test/utils';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    render(<YourComponent />);
    const user = userEvent.setup();
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    render(<YourComponent isLoading={true} />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<YourComponent error="Failed to load" />);
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

## Test Coverage Goals

### Current Coverage Status
- Component tests: ~60% of components
- Page tests: ~50% of pages
- Integration tests: Limited

### Coverage Targets
- **Components**: 80%+ coverage
- **Pages**: 80%+ coverage
- **Hooks**: 70%+ coverage
- **Utilities**: 90%+ coverage
- **Integration flows**: Key user journeys

### Areas Needing Tests
1. **Pages**
   - CoursePage (course detail/player)
   - CoursesPage (course catalog)
   - AuthPage (authentication)
   - Index (landing page)
   - NotFound

2. **Components**
   - VideoPlayer
   - ProgressCard
   - NavLink
   - TeacherSidebar
   - UI components (selective testing)

3. **Hooks**
   - use-toast
   - use-mobile

4. **Context**
   - AuthContext edge cases

5. **Integration Tests**
   - Complete course enrollment flow
   - Course creation and publishing
   - Video playback and progress
   - Payment flow

## Debugging Tests

### Common Issues and Solutions

#### 1. Timeout Errors
```typescript
// Increase timeout for slow operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

#### 2. Act Warnings
Ensure state updates are wrapped in `waitFor` or `act`:

```typescript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

#### 3. Query Failures
Use `screen.debug()` to inspect DOM:

```typescript
render(<Component />);
screen.debug(); // Prints current DOM
```

#### 4. MSW Not Mocking
Ensure handlers match the exact URL pattern:

```typescript
// Check the actual URL being called
http.get(`${SUPABASE_URL}/rest/v1/courses*`, ...)
```

## Continuous Integration

### CI Testing Strategy
- Run full test suite on every pull request
- Block merges if tests fail
- Generate coverage reports
- Track coverage trends over time

### Pre-commit Hooks (Recommended)
```bash
# Run tests before committing
npx vitest run --changed
```

## Testing Guidelines

### DO:
✅ Write tests for new features
✅ Test user-facing behavior, not implementation
✅ Use meaningful test descriptions
✅ Test error states and edge cases
✅ Keep tests focused and independent
✅ Mock external dependencies
✅ Use realistic test data

### DON'T:
❌ Test implementation details
❌ Create brittle tests dependent on internal structure
❌ Skip async/await where needed
❌ Write tests that depend on test execution order
❌ Over-mock (mock what's necessary)
❌ Ignore failing tests
❌ Test third-party library internals

## Performance Testing

### Test Execution Time
- Target: < 30 seconds for full suite
- Current: ~13 seconds
- Monitor and optimize slow tests

### Profiling Slow Tests
```bash
npx vitest run --reporter=verbose
```

## Accessibility Testing

### Testing for A11y
```typescript
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

### Learning Resources
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)
- [React Testing Guide](https://react.dev/learn/testing)

## Maintenance

### Regular Tasks
- Update test snapshots when UI changes
- Review and update mock data
- Refactor tests when components change
- Remove obsolete tests
- Improve failing tests
- Add tests for bug fixes

### Test Health Monitoring
- Review test execution time monthly
- Track flaky tests
- Maintain >80% coverage
- Update testing dependencies quarterly
