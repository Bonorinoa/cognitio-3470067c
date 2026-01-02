import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import AIStudioDashboard from './AIStudioDashboard';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { useGenerationUsage } from '@/hooks/useGenerationUsage';
import { useGenerationHistory } from '@/hooks/useGenerationHistory';
import userEvent from '@testing-library/user-event';

// Mock the hooks
vi.mock('@/hooks/useKnowledgeBase');
vi.mock('@/hooks/useStyleProfile');
vi.mock('@/hooks/useGenerationUsage');
vi.mock('@/hooks/useGenerationHistory');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AIStudioDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(useKnowledgeBase).mockReturnValue({
      documents: [],
      activeDocuments: [],
      totalTokens: 0,
      isLoading: false,
      error: null,
      createDocument: vi.fn(),
      updateDocument: vi.fn(),
      toggleActive: vi.fn(),
      deleteDocument: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    vi.mocked(useStyleProfile).mockReturnValue({
      styleProfile: null,
      isLoading: false,
      error: null,
      hasCompletedSetup: false,
      saveStyleProfile: vi.fn(),
      isSaving: false,
    });

    vi.mocked(useGenerationUsage).mockReturnValue({
      used: 0,
      remaining: 10,
      limit: 10,
      totalCount: 0,
      isLoading: false,
    });

    vi.mocked(useGenerationHistory).mockReturnValue({
      history: [],
      isLoading: false,
      saveGeneration: vi.fn(),
      updateGeneration: vi.fn(),
      deleteGeneration: vi.fn(),
      invalidate: vi.fn(),
    });
  });

  it('renders dashboard without crashing', () => {
    render(<AIStudioDashboard />);
    
    // Check that the dashboard container exists with the main content
    const container = document.querySelector('.max-w-7xl');
    expect(container).toBeInTheDocument();
    
    // Check that at least some key text is present (translation keys or actual text)
    expect(document.body.textContent).toMatch(/AI Content Studio|aiStudio.dashboardTitle/);
  });

  it('displays quick action cards', () => {
    render(<AIStudioDashboard />);
    
    // Check for links to the blog generator (there will be multiple links, so use getAllByRole)
    const blogLinks = screen.getAllByRole('link');
    const blogLink = blogLinks.find(link => link.getAttribute('href') === '/ai-studio/blog');
    expect(blogLink).toBeDefined();
    
    // Check that we have cards (at least 2 for blog and newsletter)
    const cards = document.querySelectorAll('[class*="rounded-xl"]');
    expect(cards.length).toBeGreaterThan(1);
  });

  it('shows newsletter as coming soon', () => {
    render(<AIStudioDashboard />);
    
    // Check for "Coming Soon" or "Próximamente" or the translation key
    const comingSoonElements = screen.getAllByText((content, element) => {
      const text = element?.textContent || '';
      return text.includes('Próximamente') || 
             text.includes('Coming Soon') || 
             text.includes('common.soon') ||
             text.includes('Soon');
    });
    expect(comingSoonElements.length).toBeGreaterThan(0);
  });

  it('displays stats section with correct data', () => {
    const mockDocuments = [
      { id: '1', title: 'Doc 1', is_active: true, content_tokens: 100 },
      { id: '2', title: 'Doc 2', is_active: true, content_tokens: 200 },
    ];

    vi.mocked(useKnowledgeBase).mockReturnValue({
      documents: mockDocuments as any,
      activeDocuments: mockDocuments as any,
      totalTokens: 300,
      isLoading: false,
      error: null,
      createDocument: vi.fn(),
      updateDocument: vi.fn(),
      toggleActive: vi.fn(),
      deleteDocument: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    vi.mocked(useStyleProfile).mockReturnValue({
      styleProfile: { setup_completed: true } as any,
      isLoading: false,
      error: null,
      hasCompletedSetup: true,
      saveStyleProfile: vi.fn(),
      isSaving: false,
    });

    vi.mocked(useGenerationUsage).mockReturnValue({
      used: 3,
      remaining: 7,
      limit: 10,
      totalCount: 3,
      isLoading: false,
    });

    render(<AIStudioDashboard />);

    // Check documents count - should show "2" 
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Check generations usage shows "7/10"
    expect(screen.getByText('7/10')).toBeInTheDocument();
    
    // Check that we have a progress bar for usage
    const progressBar = document.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('shows empty state when no history', () => {
    render(<AIStudioDashboard />);
    
    // EmptyState component should be rendered - check for the button or title
    const emptyStateElements = screen.getAllByText((content, element) => {
      const text = element?.textContent || '';
      return text.includes('Sin generaciones') || 
             text.includes('No recent generations') ||
             text.includes('noRecentGenerations');
    });
    // Should have at least one empty state element (title or description)
    expect(emptyStateElements.length).toBeGreaterThan(0);
  });

  it('displays recent generations when available', () => {
    const mockHistory = [
      {
        id: '1',
        content_type: 'blog' as const,
        topic: 'Test Topic 1',
        generated_content: 'Content for test 1',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        content_type: 'blog' as const,
        topic: 'Test Topic 2',
        generated_content: 'Content for test 2',
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(useGenerationHistory).mockReturnValue({
      history: mockHistory,
      isLoading: false,
      saveGeneration: vi.fn(),
      updateGeneration: vi.fn(),
      deleteGeneration: vi.fn(),
      invalidate: vi.fn(),
    });

    render(<AIStudioDashboard />);

    expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
    expect(screen.getByText('Test Topic 2')).toBeInTheDocument();
  });

  it('navigates to blog page when load button is clicked', async () => {
    const user = userEvent.setup();
    const mockHistory = [
      {
        id: 'gen-123',
        content_type: 'blog' as const,
        topic: 'Test Topic',
        generated_content: 'Test content',
        created_at: new Date().toISOString(),
      },
    ];

    vi.mocked(useGenerationHistory).mockReturnValue({
      history: mockHistory,
      isLoading: false,
      saveGeneration: vi.fn(),
      updateGeneration: vi.fn(),
      deleteGeneration: vi.fn(),
      invalidate: vi.fn(),
    });

    render(<AIStudioDashboard />);

    // Find the load button - it might have translated text or key
    const loadButton = screen.getByRole('button', { 
      name: (name) => name.includes('Cargar') || name.includes('Load') || name.includes('load')
    });
    await user.click(loadButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ai-studio/blog?load=gen-123');
    });
  });

  it('shows pending style profile status when not configured', () => {
    vi.mocked(useStyleProfile).mockReturnValue({
      styleProfile: null,
      isLoading: false,
      error: null,
      hasCompletedSetup: false,
      saveStyleProfile: vi.fn(),
      isSaving: false,
    });

    render(<AIStudioDashboard />);

    // Look for "Pendiente" or "Pending" or translation key within the style card
    // Check that the style profile card exists with pending status
    const allPendingElements = screen.getAllByText((content, element) => {
      const text = element?.textContent || '';
      return text.includes('Pendiente') || 
             text.includes('Pending') ||
             text === 'aiStudio.pending';
    });
    // Should have at least one pending status element
    expect(allPendingElements.length).toBeGreaterThan(0);
  });

  it('displays total generations count from usage hook', () => {
    vi.mocked(useGenerationUsage).mockReturnValue({
      used: 2,
      remaining: 8,
      limit: 10,
      totalCount: 25,
      isLoading: false,
    });

    vi.mocked(useGenerationHistory).mockReturnValue({
      history: [],
      isLoading: false,
      saveGeneration: vi.fn(),
      updateGeneration: vi.fn(),
      deleteGeneration: vi.fn(),
      invalidate: vi.fn(),
    });

    render(<AIStudioDashboard />);

    // Total generations should show 25 (from totalCount, not history.length)
    expect(screen.getByText('25')).toBeInTheDocument();
  });
});
