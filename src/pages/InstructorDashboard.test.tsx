import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import InstructorDashboard from './InstructorDashboard';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

const mockUser = { id: 'test-user-id', email: 'test@example.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
const mockSession = { access_token: 't', refresh_token: 'r', expires_in: 3600, token_type: 'bearer', user: mockUser } as Session;

describe('InstructorDashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser, session: mockSession, isLoading: false, signOut: vi.fn(),
    });
  });

  it('renders the welcome heading', () => {
    render(<InstructorDashboard />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/hola de nuevo/i);
  });

  it('has Crear curso CTA', () => {
    render(<InstructorDashboard />);
    expect(screen.getByRole('link', { name: /crear curso/i })).toBeInTheDocument();
  });

  it('has Abrir AI Studio CTA', () => {
    render(<InstructorDashboard />);
    expect(screen.getByRole('link', { name: /abrir ai studio/i })).toBeInTheDocument();
  });

  it('renders the courses heading', () => {
    render(<InstructorDashboard />);
    expect(screen.getByText(/tus cursos/i)).toBeInTheDocument();
  });
});
