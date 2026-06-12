import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import PasswordChangeForm from './PasswordChangeForm';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    },
  },
}));

describe('PasswordChangeForm', () => {
  beforeEach(() => vi.resetAllMocks());

  it('renders the form title', () => {
    render(<PasswordChangeForm />);
    expect(screen.getByText(/cambiar contraseña/i)).toBeInTheDocument();
  });

  it('shows new + confirm password fields', () => {
    render(<PasswordChangeForm />);
    expect(screen.getByText(/nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmar contraseña/i)).toBeInTheDocument();
  });

  it('has submit button', () => {
    render(<PasswordChangeForm />);
    expect(screen.getByRole('button', { name: /actualizar contraseña/i })).toBeInTheDocument();
  });
});
