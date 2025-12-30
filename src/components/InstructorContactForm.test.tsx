import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import InstructorContactForm from './InstructorContactForm';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null })),
    },
  },
}));

describe('InstructorContactForm', () => {
  const mockInstructorId = 'instructor-1';

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the contact form', () => {
    render(<InstructorContactForm instructorId={mockInstructorId} />);
    
    expect(screen.getByText(/ponte en contacto/i)).toBeInTheDocument();
  });

  it('shows all form fields', () => {
    render(<InstructorContactForm instructorId={mockInstructorId} />);
    
    expect(screen.getByLabelText(/tu nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tu correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tu mensaje/i)).toBeInTheDocument();
  });

  it('has submit button', () => {
    render(<InstructorContactForm instructorId={mockInstructorId} />);
    
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  it('shows subject options', () => {
    render(<InstructorContactForm instructorId={mockInstructorId} />);
    
    // Open select dropdown
    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger);
    
    // Check for options
    expect(screen.getByText(/consulta sobre curso privado/i)).toBeInTheDocument();
    expect(screen.getByText(/solicitud de consultoría/i)).toBeInTheDocument();
  });
});
