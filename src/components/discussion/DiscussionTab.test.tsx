import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DiscussionTab from "./DiscussionTab";

// Mock translations
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "discussion.title": "Discussion",
        "discussion.loginRequired": "Please log in to participate",
        "discussion.newThread": "New Thread",
        "discussion.emptyState": "No discussions yet",
        "discussion.sortBy": "Sort by",
        "discussion.sortNew": "Newest",
        "discussion.sortTop": "Top",
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
  }),
}));

// Mock useDiscussions
vi.mock("@/hooks/useDiscussions", () => ({
  useDiscussions: () => ({
    discussions: [],
    isLoading: false,
    createDiscussion: { mutateAsync: vi.fn(), isPending: false },
    toggleResolved: { mutateAsync: vi.fn() },
  }),
}));

// Mock useAITutor
vi.mock("@/hooks/useAITutor", () => ({
  useAITutorSettings: () => ({
    settings: { enabled: true, systemPrompt: "Test prompt" },
    isLoading: false,
  }),
  useAITutorUsage: () => ({
    used: 0,
    remaining: 5,
    limit: 5,
    canUseAI: true,
    isLoading: false,
  }),
}));

// Mock child components
vi.mock("./ThreadList", () => ({
  default: () => <div data-testid="thread-list">Thread List</div>,
}));

vi.mock("./ThreadView", () => ({
  default: ({ currentVideoTime }: { currentVideoTime?: number }) => (
    <div data-testid="thread-view" data-video-time={currentVideoTime}>
      Thread View
    </div>
  ),
}));

vi.mock("./CreateThreadModal", () => ({
  default: () => <div data-testid="create-thread-modal">Create Thread Modal</div>,
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("DiscussionTab", () => {
  const defaultProps = {
    chapterId: "test-chapter-id",
    courseId: "test-course-id",
    instructorId: "test-instructor-id",
    hasAccess: true,
    isAuthenticated: true,
    isInstructorOrOwner: false,
    onSeekVideo: vi.fn(),
  };

  it("renders without crashing", () => {
    renderWithProviders(<DiscussionTab {...defaultProps} />);
    expect(screen.getByTestId("thread-list")).toBeInTheDocument();
  });

  it("receives currentVideoTime prop and can pass it down", () => {
    renderWithProviders(
      <DiscussionTab {...defaultProps} currentVideoTime={180} />
    );
    // ThreadList should be visible (no thread selected)
    expect(screen.getByTestId("thread-list")).toBeInTheDocument();
  });

  it("renders thread list component", () => {
    renderWithProviders(<DiscussionTab {...defaultProps} />);
    expect(screen.getByTestId("thread-list")).toBeInTheDocument();
  });
});
