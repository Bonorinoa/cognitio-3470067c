import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Navbar from './Navbar';
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
  id: 'test-id',
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

describe('Navbar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders logo and site name', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('LearnHub')).toBeInTheDocument();
  });

  it('shows Sign In button when user is not logged in', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows loading state while auth is loading', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: true,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    // Should show loading skeleton
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows user avatar when logged in', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByText('T')).toBeInTheDocument(); // First letter of email
    });
  });

  it('shows Browse Courses link', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('Browse Courses')).toBeInTheDocument();
  });

  it('shows My Learning link when user is logged in', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('My Learning')).toBeInTheDocument();
  });

  it('does not show My Learning link when user is not logged in', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.queryByText('My Learning')).not.toBeInTheDocument();
  });
});
