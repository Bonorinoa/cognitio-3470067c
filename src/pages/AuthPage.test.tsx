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
    expect(screen.getByText(/bienvenido a cognitio/i)).toBeInTheDocument();
    expect(screen.getAllByText(/iniciar sesión/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  it('shows email + password inputs and submit button', () => {
    render(<AuthPage />);
    expect(screen.getAllByLabelText(/email/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/contraseña/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('switches to signup tab and shows full name field', async () => {
    render(<AuthPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('tab', { name: /registrarse/i }));
    await waitFor(() => expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument());
  });

  it('shows forgot password link', () => {
    render(<AuthPage />);
    expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument();
  });

  it('shows ToS and Privacy Policy links', () => {
    render(<AuthPage />);
    expect(screen.getByText(/términos de servicio/i)).toBeInTheDocument();
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument();
  });

  it('shows back to home link', () => {
    render(<AuthPage />);
    expect(screen.getByText(/volver al inicio/i)).toBeInTheDocument();
  });
});
