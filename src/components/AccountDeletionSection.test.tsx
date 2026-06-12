import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import AccountDeletionSection from './AccountDeletionSection';
import * as AuthContext from '@/contexts/AuthContext';
import { User, Session } from '@supabase/supabase-js';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: { invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null })) },
  },
}));

const mockUser = { id: 'u', email: 't@t.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' } as User;
const mockSession = { access_token: 't', refresh_token: 'r', expires_in: 3600, token_type: 'bearer', user: mockUser } as Session;

describe('AccountDeletionSection', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser, session: mockSession, isLoading: false, signOut: vi.fn(),
    });
  });

  it('renders the deletion heading', () => {
    render(<AccountDeletionSection />);
    expect(screen.getByText(/Eliminar Cuenta/i)).toBeInTheDocument();
  });

  it('shows the trigger button', () => {
    render(<AccountDeletionSection />);
    expect(screen.getByRole('button', { name: /eliminar mi cuenta/i })).toBeInTheDocument();
  });
});
