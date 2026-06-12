import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import InstructorServicesManager from './InstructorServicesManager';
import * as AuthContext from '@/contexts/AuthContext';
import { User, Session } from '@supabase/supabase-js';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: () => ({
      data: [{ id: 's1', title: 'Consultoría 1 a 1', description: 'Sesión personalizada', price: 100, duration_minutes: 60, is_active: true }],
      isLoading: false,
      error: null,
    }),
    useMutation: () => ({ mutate: vi.fn(), isPending: false }),
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
  };
});

const mockUser = { id: 'instr', email: 'i@e.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } as User;
const mockSession = { access_token: 't', refresh_token: 'r', expires_in: 3600, token_type: 'bearer', user: mockUser } as Session;

describe('InstructorServicesManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser, session: mockSession, isLoading: false, signOut: vi.fn(),
    });
  });

  it('renders services title', () => {
    render(<InstructorServicesManager />);
    expect(screen.getByText(/consulting services/i)).toBeInTheDocument();
  });

  it('displays existing service', () => {
    render(<InstructorServicesManager />);
    expect(screen.getByText('Consultoría 1 a 1')).toBeInTheDocument();
  });

  it('shows add service button', () => {
    render(<InstructorServicesManager />);
    expect(screen.getByRole('button', { name: /add service/i })).toBeInTheDocument();
  });

  it('displays service price', () => {
    render(<InstructorServicesManager />);
    expect(screen.getByText(/\$100/)).toBeInTheDocument();
  });

  it('displays service duration', () => {
    render(<InstructorServicesManager />);
    expect(screen.getByText(/1h/)).toBeInTheDocument();
  });
});
