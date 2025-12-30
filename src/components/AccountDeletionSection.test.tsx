import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import AccountDeletionSection from './AccountDeletionSection';
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

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null })),
    },
  },
}));

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

describe('AccountDeletionSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the account deletion section', () => {
    render(<AccountDeletionSection />);
    
    expect(screen.getByText(/eliminar cuenta/i)).toBeInTheDocument();
  });

  it('shows warning about permanent deletion', () => {
    render(<AccountDeletionSection />);
    
    expect(screen.getByText(/esta acción no se puede deshacer/i)).toBeInTheDocument();
  });

  it('has delete account button', () => {
    render(<AccountDeletionSection />);
    
    expect(screen.getByRole('button', { name: /eliminar mi cuenta/i })).toBeInTheDocument();
  });

  it('opens confirmation dialog when clicking delete', async () => {
    render(<AccountDeletionSection />);
    
    const deleteButton = screen.getByRole('button', { name: /eliminar mi cuenta/i });
    fireEvent.click(deleteButton);
    
    // Wait for dialog to appear
    expect(await screen.findByText(/estás completamente seguro/i)).toBeInTheDocument();
  });
});
