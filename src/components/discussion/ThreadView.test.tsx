import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThreadView from "./ThreadView";
import { Discussion } from "@/hooks/useDiscussions";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "discussion.backToList": "Back to list",
        "discussion.resolved": "Resolved",
        "discussion.replies": "replies",
        "discussion.noReplies": "No replies yet",
        "discussion.anonymous": "Anonymous",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  }),
}));

// Mock AuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
    session: { access_token: "test-token" },
    isLoading: false,
    signOut: vi.fn(),
  }),
}));

// Mock useDiscussions
const mockReplies: { id: string; content: string; upvote_count: number; is_ai_generated: boolean; created_at: string; author: { full_name: string; avatar_url: string | null } | null; is_accepted_answer: boolean; parent_reply_id: string | null }[] = [];
const mockCreateReply = { mutateAsync: vi.fn(), isPending: false };
const mockToggleAccepted = { mutateAsync: vi.fn() };
const mockVote = { mutateAsync: vi.fn() };

vi.mock("@/hooks/useDiscussions", () => ({
  useDiscussionReplies: () => ({
    replies: mockReplies,
    isLoading: false,
    createReply: mockCreateReply,
    toggleAccepted: mockToggleAccepted,
  }),
  useDiscussionVotes: () => ({
    getUserVotes: vi.fn().mockResolvedValue({}),
    vote: mockVote,
  }),
}));

// Mock useAITutor
vi.mock("@/hooks/useAITutor", () => ({
  useAITutorSettings: () => ({
    settings: { enabled: true, systemPrompt: "Test prompt" },
    isLoading: false,
  }),
  useAITutorUsage: () => ({
    used: 1,
    remaining: 4,
    limit: 5,
    canUseAI: true,
    isLoading: false,
  }),
  useAITutorReply: () => ({
    generateReply: { mutateAsync: vi.fn(), isPending: false },
    isGenerating: false,
  }),
}));

// Mock ReplyComposer
vi.mock("./ReplyComposer", () => ({
  default: ({ currentVideoTime }: { currentVideoTime?: number }) => (
    <div data-testid="reply-composer" data-video-time={currentVideoTime}>
      Reply Composer
    </div>
  ),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

const mockDiscussion: Discussion = {
  id: "test-discussion-id",
  chapter_id: "test-chapter-id",
  course_id: "test-course-id",
  title: "Test Discussion Title",
  content: "This is the discussion content",
  user_id: "other-user-id",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_resolved: false,
  upvote_count: 5,
  reply_count: 0,
  video_timestamp_seconds: 120,
  has_ai_response: false,
  author: {
    full_name: "Test Author",
    avatar_url: null,
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("ThreadView", () => {
  const defaultProps = {
    discussion: mockDiscussion,
    hasAccess: true,
    isAuthenticated: true,
    isInstructorOrOwner: false,
    onBack: vi.fn(),
    onSeekVideo: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders discussion title", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("Test Discussion Title")).toBeInTheDocument();
  });

  it("renders discussion content", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("This is the discussion content")).toBeInTheDocument();
  });

  it("renders back button", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("Back to list")).toBeInTheDocument();
  });

  it("renders author name", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("Test Author")).toBeInTheDocument();
  });

  it("shows timestamp badge with clickable functionality", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    // 120 seconds = 2:00
    expect(screen.getByText("2:00")).toBeInTheDocument();
  });

  it("shows resolved badge when discussion is resolved", () => {
    const resolvedDiscussion = { ...mockDiscussion, is_resolved: true };
    renderWithProviders(<ThreadView {...defaultProps} discussion={resolvedDiscussion} />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("renders ReplyComposer when user has access", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByTestId("reply-composer")).toBeInTheDocument();
  });

  it("does not render ReplyComposer when user lacks access", () => {
    renderWithProviders(<ThreadView {...defaultProps} hasAccess={false} />);
    expect(screen.queryByTestId("reply-composer")).not.toBeInTheDocument();
  });

  it("does not render ReplyComposer when not authenticated", () => {
    renderWithProviders(<ThreadView {...defaultProps} isAuthenticated={false} />);
    expect(screen.queryByTestId("reply-composer")).not.toBeInTheDocument();
  });

  it("passes currentVideoTime to ReplyComposer", () => {
    renderWithProviders(<ThreadView {...defaultProps} currentVideoTime={253} />);
    const replyComposer = screen.getByTestId("reply-composer");
    expect(replyComposer).toHaveAttribute("data-video-time", "253");
  });

  it("shows no replies message when replies list is empty", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("No replies yet")).toBeInTheDocument();
  });

  it("displays vote count for discussion", () => {
    renderWithProviders(<ThreadView {...defaultProps} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
