import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import AdminPanel from './AdminPanel';
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

// Mock useUserRole hook
vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({
    isAdmin: true,
    isInstructor: true,
    isStudent: true,
    isLoading: false,
  }),
}));

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: [
        { id: 'user-1', email: 'admin@example.com', full_name: 'Admin User', roles: ['admin'] },
        { id: 'user-2', email: 'instructor@example.com', full_name: 'Instructor User', roles: ['instructor'] },
      ],
      isLoading: false,
      error: null,
    }),
    useMutation: () => ({
      mutate: vi.fn(),
      isPending: false,
    }),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

const mockUser: Partial<User> = {
  id: 'admin-user-id',
  email: 'admin@example.com',
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

describe('AdminPanel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the admin panel', () => {
    render(<AdminPanel />);
    expect(screen.getByRole('heading', { level: 1, name: /panel de administración/i })).toBeInTheDocument();
  });

  it('displays user management section', () => {
    render(<AdminPanel />);
    expect(screen.getByText(/gestión de usuarios/i)).toBeInTheDocument();
  });

  it('shows user table with columns', () => {
    render(<AdminPanel />);
    expect(screen.getAllByRole('columnheader', { name: /usuario/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('columnheader', { name: /email/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('columnheader', { name: /roles/i })).toBeInTheDocument();
  });

  it('has a search input', () => {
    render(<AdminPanel />);
    expect(screen.getByPlaceholderText(/buscar por nombre o email/i)).toBeInTheDocument();
  });
});
