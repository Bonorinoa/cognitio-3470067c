import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import CreateCourse from './CreateCourse';
import { User, Session } from '@supabase/supabase-js';
import * as AuthContext from '@/contexts/AuthContext';

// Mock useAuth hook
vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
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

    expect(screen.getByText('Create New Course')).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Course Chapters')).toBeInTheDocument();
  });

  it('has title input field', () => {
    render(<CreateCourse />);

    const titleInput = screen.getByPlaceholderText(/Complete Web Development Bootcamp/i);
    expect(titleInput).toBeInTheDocument();
  });

  it('has description textarea', () => {
    render(<CreateCourse />);

    const descriptionInput = screen.getByPlaceholderText(/Describe what students will learn/i);
    expect(descriptionInput).toBeInTheDocument();
  });

  it('has price input', () => {
    render(<CreateCourse />);

    const priceInput = screen.getByPlaceholderText('99.99');
    expect(priceInput).toBeInTheDocument();
  });

  it('has Save Draft and Publish buttons', () => {
    render(<CreateCourse />);

    expect(screen.getByText('Save Draft')).toBeInTheDocument();
    expect(screen.getByText('Publish Course')).toBeInTheDocument();
  });

  it('has Add Chapter button', () => {
    render(<CreateCourse />);

    expect(screen.getByText('Add Chapter')).toBeInTheDocument();
  });

  it('allows adding new chapters', () => {
    render(<CreateCourse />);

    const addButton = screen.getByText('Add Chapter');
    fireEvent.click(addButton);

    // Should now have 2 chapter inputs (one default + one new)
    const chapterInputs = screen.getAllByPlaceholderText('Chapter title');
    expect(chapterInputs.length).toBe(2);
  });

  it('navigates back when clicking Back button', () => {
    render(<CreateCourse />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/instructor');
  });

  it('has category selector', () => {
    render(<CreateCourse />);

    expect(screen.getByText('Select category')).toBeInTheDocument();
  });

  it('has course image upload section', () => {
    render(<CreateCourse />);

    expect(screen.getByText(/course image/i)).toBeInTheDocument();
    expect(screen.getByText(/upload image/i)).toBeInTheDocument();
  });
});
