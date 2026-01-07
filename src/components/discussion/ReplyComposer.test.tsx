import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReplyComposer from "./ReplyComposer";

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "discussion.aiTutorDisabled": "AI Tutor is currently disabled",
        "discussion.replyPlaceholder": "Write a reply...",
        "discussion.replyPlaceholderAI": "Write a reply or mention @CognitioAI...",
        "discussion.aiCallsRemaining": `${params?.count || 0} AI calls remaining`,
        "discussion.aiContextAt": `Context: ${params?.time || "0:00"}`,
        "discussion.aiWillRespond": "CognitioAI will respond",
        "discussion.aiLimitReached": "AI limit reached",
        "discussion.generatingAI": "Generating...",
        "discussion.aiTakesTime": "This may take a few seconds...",
        "discussion.posting": "Posting...",
        "discussion.reply": "Reply",
      };
      return translations[key] || key;
    },
    i18n: { language: "en" },
  }),
}));

// Mock MentionInput as a simple textarea
vi.mock("./MentionInput", () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <textarea
      data-testid="mention-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

describe("ReplyComposer", () => {
  const defaultProps = {
    onSubmit: vi.fn().mockResolvedValue(undefined),
    isSubmitting: false,
    aiEnabled: true,
    aiRemaining: 5,
    aiUsed: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<ReplyComposer {...defaultProps} />);
    expect(screen.getByTestId("mention-input")).toBeInTheDocument();
  });

  it("shows AI disabled alert when AI is not enabled", () => {
    render(<ReplyComposer {...defaultProps} aiEnabled={false} />);
    expect(screen.getByText("AI Tutor is currently disabled")).toBeInTheDocument();
  });

  it("shows AI calls remaining badge when AI is enabled", () => {
    render(<ReplyComposer {...defaultProps} aiRemaining={3} />);
    expect(screen.getByText("3 AI calls remaining")).toBeInTheDocument();
  });

  it("shows reply button", () => {
    render(<ReplyComposer {...defaultProps} />);
    expect(screen.getByRole("button", { name: /reply/i })).toBeInTheDocument();
  });

  it("disables submit button when content is empty", () => {
    render(<ReplyComposer {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /reply/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when content is entered", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "Hello world");

    const submitButton = screen.getByRole("button", { name: /reply/i });
    expect(submitButton).not.toBeDisabled();
  });

  it("shows AI will respond badge when @CognitioAI is mentioned", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI help me");

    expect(screen.getByText("CognitioAI will respond")).toBeInTheDocument();
  });

  it("shows AI limit reached badge when no AI calls remaining", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} aiRemaining={0} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI help me");

    expect(screen.getByText("AI limit reached")).toBeInTheDocument();
  });

  it("shows timestamp context badge when AI is mentioned and video time is set", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} currentVideoTime={253} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI what is this about?");

    // 253 seconds = 4:13
    expect(screen.getByText("Context: 4:13")).toBeInTheDocument();
  });

  it("does not show timestamp context when video time is 0", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} currentVideoTime={0} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI what is this about?");

    expect(screen.queryByText(/Context:/)).not.toBeInTheDocument();
  });

  it("does not show timestamp context when AI is not mentioned", async () => {
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} currentVideoTime={100} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "Just a regular reply");

    expect(screen.queryByText(/Context:/)).not.toBeInTheDocument();
  });

  it("calls onSubmit with correct parameters when submitting", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} onSubmit={mockSubmit} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "Test reply");

    const submitButton = screen.getByRole("button", { name: /reply/i });
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith("Test reply", false);
  });

  it("calls onSubmit with mentionsAI=true when @CognitioAI is mentioned", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} onSubmit={mockSubmit} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI help");

    const submitButton = screen.getByRole("button", { name: /reply/i });
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith("@CognitioAI help", true);
  });

  it("shows loading state when submitting", () => {
    render(<ReplyComposer {...defaultProps} isSubmitting={true} />);
    expect(screen.getByText("Posting...")).toBeInTheDocument();
  });

  it("shows AI generating state when submitting AI request", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ReplyComposer {...defaultProps} />);

    const textarea = screen.getByTestId("mention-input");
    await user.type(textarea, "@CognitioAI help");

    // Simulate submitting state with AI mention
    rerender(<ReplyComposer {...defaultProps} isSubmitting={true} />);

    // Re-type to trigger mentionsAI detection
    const textarea2 = screen.getByTestId("mention-input");
    await user.clear(textarea2);
    await user.type(textarea2, "@CognitioAI help");

    expect(screen.getByText("Generating...")).toBeInTheDocument();
    expect(screen.getByText("This may take a few seconds...")).toBeInTheDocument();
  });

  it("clears input after successful submit", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ReplyComposer {...defaultProps} onSubmit={mockSubmit} />);

    const textarea = screen.getByTestId("mention-input") as HTMLTextAreaElement;
    await user.type(textarea, "Test reply");

    const submitButton = screen.getByRole("button", { name: /reply/i });
    await user.click(submitButton);

    // After submit, input should be cleared
    expect(textarea.value).toBe("");
  });
});
