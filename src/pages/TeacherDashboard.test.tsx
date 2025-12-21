import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import TeacherDashboard from './TeacherDashboard';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

// Mock useAuth hook
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockUser: Partial<User> = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const mockSession: Partial<Session> = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser as User,
};

describe('TeacherDashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the teacher dashboard', () => {
    render(<TeacherDashboard />);

    expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage your courses and track performance')).toBeInTheDocument();
  });

  it('shows Create Course button', () => {
    render(<TeacherDashboard />);

    expect(screen.getByText('Create Course')).toBeInTheDocument();
  });

  it('shows stats cards', async () => {
    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Total Students')).toBeInTheDocument();
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('Published Courses')).toBeInTheDocument();
      expect(screen.getByText('Draft Courses')).toBeInTheDocument();
    });
  });

  it('shows Your Courses section', () => {
    render(<TeacherDashboard />);

    expect(screen.getByText('Your Courses')).toBeInTheDocument();
  });

  it('shows Recent Enrollments section', () => {
    render(<TeacherDashboard />);

    expect(screen.getByText('Recent Enrollments')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<TeacherDashboard />);

    // Should show skeletons while loading
    const skeletons = document.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no courses exist', async () => {
    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No courses yet')).toBeInTheDocument();
    });
  });

  it('shows empty enrollments message when no enrollments', async () => {
    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No enrollments yet')).toBeInTheDocument();
    });
  });

  it('has View All link for courses', () => {
    render(<TeacherDashboard />);

    expect(screen.getByText('View All')).toBeInTheDocument();
  });
});
