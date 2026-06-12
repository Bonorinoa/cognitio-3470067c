import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import Index from './Index';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async () => {
  const actual = await vi.importActual('@/contexts/AuthContext');
  return { ...actual, useAuth: vi.fn() };
});

const loggedOut = { user: null, session: null, isLoading: false, signOut: vi.fn() };

describe('Index (Landing Page)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(AuthContext.useAuth).mockReturnValue(loggedOut);
  });

  it('renders without crashing', () => {
    render(<Index />);
    expect(document.body).toBeInTheDocument();
  });

  it('has a navigation bar', () => {
    render(<Index />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders interactive links/CTAs', () => {
    render(<Index />);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });
});
