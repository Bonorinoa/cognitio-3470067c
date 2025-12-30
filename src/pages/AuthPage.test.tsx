import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import AuthPage from './AuthPage';
import * as AuthContext from '@/contexts/AuthContext';

// Mock useAuth hook
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: null,
      session: null,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the auth page with login form', () => {
    render(<AuthPage />);
    
    expect(screen.getByText('Bienvenido a Cognitio')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('shows login form elements', () => {
    render(<AuthPage />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('can switch to signup tab', async () => {
    render(<AuthPage />);
    
    const signupTab = screen.getByText('Registrarse');
    fireEvent.click(signupTab);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    });
  });

  it('shows forgot password link', () => {
    render(<AuthPage />);
    
    expect(screen.getByText(/olvidaste tu contraseña/i)).toBeInTheDocument();
  });

  it('shows terms of service and privacy policy links', () => {
    render(<AuthPage />);
    
    expect(screen.getByText(/términos de servicio/i)).toBeInTheDocument();
    expect(screen.getByText(/política de privacidad/i)).toBeInTheDocument();
  });

  it('shows back to home link', () => {
    render(<AuthPage />);
    
    expect(screen.getByText(/volver al inicio/i)).toBeInTheDocument();
  });
});
