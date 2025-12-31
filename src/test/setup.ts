import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

// Mock i18next to always return the key as-is (simulating English) for tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Return English strings for known keys
      const translations: Record<string, string> = {
        'instructorDashboard.title': 'Instructor Dashboard',
        'instructorDashboard.subtitle': 'Manage your courses and track performance',
        'instructorDashboard.createCourse': 'Create Course',
        'instructorDashboard.totalStudents': 'Total Students',
        'instructorDashboard.totalRevenue': 'Total Revenue',
        'instructorDashboard.publishedCourses': 'Published Courses',
        'instructorDashboard.draftCourses': 'Draft Courses',
        'instructorDashboard.yourCourses': 'Your Courses',
        'instructorDashboard.viewAll': 'View All',
        'instructorDashboard.recentEnrollments': 'Recent Enrollments',
        'instructorDashboard.noCourses': 'No courses yet',
        'instructorDashboard.noEnrollments': 'No enrollments yet',
        'instructorDashboard.published': 'Published',
        'instructorDashboard.draft': 'Draft',
        'instructorDashboard.course': 'Course',
        'instructorDashboard.status': 'Status',
        'instructorDashboard.students': 'Students',
        'instructorDashboard.revenue': 'Revenue',
        'instructorDashboard.view': 'View',
        'instructorDashboard.edit': 'Edit',
        'instructorDashboard.createFirst': 'Create your first course',
        'courseCard.enrollNow': 'Enroll Now',
        'courseCard.continue': 'Continue',
        'courseCard.complete': 'complete',
        'courseCard.chapters': 'chapters',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset any request handlers after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
