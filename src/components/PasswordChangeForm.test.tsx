import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import PasswordChangeForm from './PasswordChangeForm';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    },
  },
}));

describe('PasswordChangeForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the password change form', () => {
    render(<PasswordChangeForm />);
    
    expect(screen.getByText(/cambiar contraseña/i)).toBeInTheDocument();
  });

  it('shows all password fields', () => {
    render(<PasswordChangeForm />);
    
    expect(screen.getByLabelText(/contraseña actual/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar nueva contraseña/i)).toBeInTheDocument();
  });

  it('has submit button', () => {
    render(<PasswordChangeForm />);
    
    expect(screen.getByRole('button', { name: /cambiar contraseña/i })).toBeInTheDocument();
  });

  it('shows description text', () => {
    render(<PasswordChangeForm />);
    
    expect(screen.getByText(/actualiza tu contraseña/i)).toBeInTheDocument();
  });
});
