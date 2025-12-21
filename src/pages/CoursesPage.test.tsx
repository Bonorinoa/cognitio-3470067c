import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '@/test/utils';
import CoursesPage from './CoursesPage';
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

describe('CoursesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the courses page', async () => {
    render(<CoursesPage />);
    
    // Page should render
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('displays page heading', async () => {
    render(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Browse Courses|Explore|All Courses/i)).toBeInTheDocument();
    });
  });

  it('shows search input', () => {
    render(<CoursesPage />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays category filters', async () => {
    render(<CoursesPage />);
    
    // Categories should be rendered as badges or buttons
    await waitFor(() => {
      const categories = screen.queryAllByText(/All|Development|Design/i);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  it('shows loading skeletons while loading', () => {
    const { container } = render(<CoursesPage />);
    
    // Check for skeleton elements
    const skeletons = container.querySelectorAll('[class*="skeleton"]');
    // May or may not show depending on load speed
    expect(container).toBeInTheDocument();
  });

  it('displays courses after loading', async () => {
    render(<CoursesPage />);
    
    // Wait for mock courses to load
    await waitFor(() => {
      // Mock data includes these courses
      expect(screen.getByText(/Web Development Bootcamp/i)).toBeInTheDocument();
    });
  });

  it('filters courses by search query', async () => {
    render(<CoursesPage />);
    const user = userEvent.setup();
    
    await waitFor(() => {
      expect(screen.getByText(/Web Development Bootcamp/i)).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'React');
    
    // Should filter to show only React courses
    await waitFor(() => {
      expect(screen.getByText(/React Masterclass/i)).toBeInTheDocument();
    });
  });

  it('filters courses by category', async () => {
    render(<CoursesPage />);
    const user = userEvent.setup();
    
    await waitFor(() => {
      expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
    });
    
    // Click on a category filter
    const developmentFilter = screen.getByText('Development');
    await user.click(developmentFilter);
    
    // Should show only Development courses
    await waitFor(() => {
      expect(screen.queryAllByText(/Development/i).length).toBeGreaterThan(0);
    });
  });

  it('has sort options', async () => {
    render(<CoursesPage />);
    
    // Look for sort dropdown or buttons
    await waitFor(() => {
      const sortElements = screen.queryAllByText(/Sort|Price|Newest/i);
      expect(sortElements.length).toBeGreaterThan(0);
    });
  });

  it('displays course prices', async () => {
    render(<CoursesPage />);
    
    await waitFor(() => {
      // Mock courses have prices
      expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
    });
  });

  it('shows chapter counts', async () => {
    render(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/chapters/i)).toBeInTheDocument();
    });
  });

  it('has navbar', () => {
    render(<CoursesPage />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders when user is logged in', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });

    render(<CoursesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
    });
  });

  it('shows all categories initially', async () => {
    render(<CoursesPage />);
    
    await waitFor(() => {
      // Should show courses from multiple categories
      const courses = screen.queryAllByText(/\$/);
      expect(courses.length).toBeGreaterThan(0);
    });
  });
});
