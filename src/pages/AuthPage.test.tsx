import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, userEvent } from '@/test/utils';
import AuthPage from './AuthPage';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
  },
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null, session: null, isLoading: false, signOut: vi.fn(),
    });
  });

  it('renders welcome heading and tabs', () => {
    render(<AuthPage />);
    expect(screen.getByText(/welcome to cognitio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sign in/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows email + password inputs and submit button', () => {
    render(<AuthPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
  });

  it('switches to signup tab and shows full name field', async () => {
    render(<AuthPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /sign up/i }));
    await waitFor(() => expect(screen.getByLabelText(/full name/i)).toBeInTheDocument());
  });

  it('shows forgot password link', () => {
    render(<AuthPage />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('shows ToS and Privacy Policy links', () => {
    render(<AuthPage />);
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it('shows back to home link', () => {
    render(<AuthPage />);
    expect(screen.getByText(/back to home/i)).toBeInTheDocument();
  });
});
