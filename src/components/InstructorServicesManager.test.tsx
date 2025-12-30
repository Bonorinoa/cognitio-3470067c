import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import InstructorServicesManager from './InstructorServicesManager';
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

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: [
        {
          id: 'service-1',
          title: 'Consultoría 1 a 1',
          description: 'Sesión personalizada de consultoría',
          price: 100,
          duration_minutes: 60,
          is_active: true,
        },
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
  id: 'instructor-user-id',
  email: 'instructor@example.com',
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

describe('InstructorServicesManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders services section', () => {
    render(<InstructorServicesManager />);
    
    expect(screen.getByText(/servicios de consultoría/i)).toBeInTheDocument();
  });

  it('displays existing service', () => {
    render(<InstructorServicesManager />);
    
    expect(screen.getByText('Consultoría 1 a 1')).toBeInTheDocument();
  });

  it('shows add service button', () => {
    render(<InstructorServicesManager />);
    
    expect(screen.getByText(/agregar servicio/i)).toBeInTheDocument();
  });

  it('displays service price', () => {
    render(<InstructorServicesManager />);
    
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });

  it('displays service duration', () => {
    render(<InstructorServicesManager />);
    
    expect(screen.getByText(/60 min/)).toBeInTheDocument();
  });
});
