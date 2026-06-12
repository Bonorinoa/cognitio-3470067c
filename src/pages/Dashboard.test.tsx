import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import StudentDashboard from './Dashboard';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

const mockUser = { id: 'u', email: 't@t.com', app_metadata: {}, user_metadata: { full_name: 'Test User' }, aud: 'authenticated', created_at: new Date().toISOString() } as User;
const mockSession = { access_token: 't', refresh_token: 'r', expires_in: 3600, token_type: 'bearer', user: mockUser } as Session;

describe('Dashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser, session: mockSession, isLoading: false, signOut: vi.fn(),
    });
  });

  it('renders welcome heading', async () => {
    render(<StudentDashboard />);
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/hola de nuevo/i));
  });

  it('renders Tus cursos section', async () => {
    render(<StudentDashboard />);
    await waitFor(() => expect(screen.getByText(/tus cursos/i)).toBeInTheDocument());
  });
});
