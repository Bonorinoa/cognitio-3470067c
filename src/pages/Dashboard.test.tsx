import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import StudentDashboard from './Dashboard';
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

// Mock react-router-dom Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  };
});

const mockUser: Partial<User> = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Test User' },
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

describe('Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to auth page when user is not logged in', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/auth');
    });
  });

  it('shows loading state while auth is loading', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: true,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    // Should show skeletons
    const skeletons = document.querySelectorAll('[class*="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders welcome message when logged in', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back/)).toBeInTheDocument();
    });
  });

  it('shows empty state when no courses enrolled', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No courses yet')).toBeInTheDocument();
    });
  });

  it('shows stats cards', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Courses Enrolled')).toBeInTheDocument();
      expect(screen.getByText('Courses Completed')).toBeInTheDocument();
      expect(screen.getByText('Chapters Done')).toBeInTheDocument();
      expect(screen.getByText('Overall Progress')).toBeInTheDocument();
    });
  });

  it('has search input', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search your courses...');
      expect(searchInput).toBeInTheDocument();
    });
  });
});
