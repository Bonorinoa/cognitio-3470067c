import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Navbar from './Navbar';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

const mockUser = { id: 'test-id', email: 'test@example.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: new Date().toISOString() } as User;
const mockSession = { access_token: 't', refresh_token: 'r', expires_in: 3600, token_type: 'bearer', user: mockUser } as Session;

const loggedOut = { user: null, session: null, isLoading: false, signOut: vi.fn() };
const loggedIn = { user: mockUser, session: mockSession, isLoading: false, signOut: vi.fn() };

describe('Navbar', () => {
  beforeEach(() => vi.resetAllMocks());

  it('renders the Cognitio brand mark', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedOut);
    render(<Navbar />);
    expect(screen.getByText('Cognitio')).toBeInTheDocument();
  });

  it('shows Sign In when logged out', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedOut);
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('shows loading skeleton during auth load', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue({ ...loggedOut, isLoading: true });
    render(<Navbar />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows user avatar initial when logged in', async () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedIn);
    render(<Navbar />);
    await waitFor(() => expect(screen.getByText('T')).toBeInTheDocument());
  });

  it('exposes Courses link in primary nav', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedOut);
    render(<Navbar />);
    expect(screen.getByRole('link', { name: /^cursos$/i })).toBeInTheDocument();
  });

  it('does not show My Learning when logged out', () => {
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedOut);
    render(<Navbar />);
    expect(screen.queryByText(/my learning/i)).not.toBeInTheDocument();
  });
});
