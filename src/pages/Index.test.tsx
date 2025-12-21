import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import Index from './Index';
import * as AuthContext from '@/contexts/AuthContext';
import { User, Session } from '@supabase/supabase-js';

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

describe('Index (Landing Page)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the landing page', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('displays the hero section', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Check for main heading or key content in hero
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows featured courses', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Featured courses are hardcoded in the component
    expect(screen.getByText(/Complete Web Development Bootcamp/i)).toBeInTheDocument();
    expect(screen.getByText(/Machine Learning & AI Fundamentals/i)).toBeInTheDocument();
    expect(screen.getByText(/UI\/UX Design Masterclass/i)).toBeInTheDocument();
  });

  it('displays platform statistics', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Check for stats display
    expect(screen.getByText(/Active Learners/i)).toBeInTheDocument();
    expect(screen.getByText(/Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Completion Rate/i)).toBeInTheDocument();
  });

  it('has navigation bar', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Navbar should be present
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('shows call-to-action buttons', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Look for CTA buttons by role
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('displays course cards with correct information', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Course details
    expect(screen.getByText(/\$89\.99/)).toBeInTheDocument(); // First course price
    expect(screen.getByText(/42 chapters/i)).toBeInTheDocument();
  });

  it('renders correctly when user is logged in', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<Index />);
    
    // Page should still render
    expect(screen.getByText(/Complete Web Development Bootcamp/i)).toBeInTheDocument();
  });
});
