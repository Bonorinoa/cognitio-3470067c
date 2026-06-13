import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import CreateCourse from './CreateCourse';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

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

describe('CreateCourse', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue({
      user: mockUser as User,
      session: mockSession as Session,
      isLoading: false,
      signOut: vi.fn(),
    });
  });

  it('renders the create course form', () => {
    render(<CreateCourse />);
    expect(screen.getByText('Crear Nuevo Curso')).toBeInTheDocument();
    expect(screen.getByText('Información Básica')).toBeInTheDocument();
    expect(screen.getByText('Capítulos del Curso')).toBeInTheDocument();
  });

  it('has title input field', () => {
    render(<CreateCourse />);
    expect(screen.getByPlaceholderText(/Bootcamp Completo/i)).toBeInTheDocument();
  });

  it('has description textarea', () => {
    render(<CreateCourse />);
    expect(screen.getByPlaceholderText(/los estudiantes aprenderán/i)).toBeInTheDocument();
  });

  it('has price input', () => {
    render(<CreateCourse />);
    expect(screen.getByPlaceholderText('99.99')).toBeInTheDocument();
  });

  it('has Save Draft and Publish buttons', () => {
    render(<CreateCourse />);
    expect(screen.getByText('Guardar Borrador')).toBeInTheDocument();
    expect(screen.getByText('Publicar Curso')).toBeInTheDocument();
  });

  it('has Add Chapter button', () => {
    render(<CreateCourse />);
    expect(screen.getByText('Agregar Capítulo')).toBeInTheDocument();
  });

  it('allows adding new chapters', () => {
    render(<CreateCourse />);
    fireEvent.click(screen.getByText('Agregar Capítulo'));
    const chapterInputs = screen.getAllByPlaceholderText('Título del capítulo');
    expect(chapterInputs.length).toBe(2);
  });

  it('navigates back when clicking Back button', () => {
    render(<CreateCourse />);
    fireEvent.click(screen.getByText('Volver'));
    expect(mockNavigate).toHaveBeenCalledWith('/instructor');
  });

  it('has category selector', () => {
    render(<CreateCourse />);
    expect(screen.getByText('Seleccionar categoría')).toBeInTheDocument();
  });

  it('has course image upload section', () => {
    render(<CreateCourse />);
    expect(screen.getAllByText(/imagen del curso/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/subir imagen/i)).toBeInTheDocument();
  });
});
