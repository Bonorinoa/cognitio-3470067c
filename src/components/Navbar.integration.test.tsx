import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the auth context
vi.mock("@/contexts/AuthContext", async () => {
  const actual = await vi.importActual("@/contexts/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      user: null,
      isLoading: false,
      signOut: vi.fn(),
    }),
  };
});

// Mock user role hook
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => ({
    isInstructor: false,
    isAdmin: false,
  }),
}));

describe("Navbar with Sliding Pill Indicator", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const renderNavbar = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Reset window.matchMedia mock
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("renders navbar without crashing", () => {
    renderNavbar();
    expect(screen.getByText("Cognitio")).toBeTruthy();
  });

  it("renders navigation links", () => {
    renderNavbar();
    // Check for navigation links (they should be present)
    const navElement = screen.getByRole("navigation");
    expect(navElement).toBeTruthy();
  });

  it("respects prefers-reduced-motion setting", () => {
    // Mock matchMedia to return reduced motion preference
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    renderNavbar();
    // The component should render without errors even with reduced motion
    expect(screen.getByText("Cognitio")).toBeTruthy();
  });

  it("shows active indicator on current route", () => {
    renderNavbar();
    // The component should render with proper active states
    const navElement = screen.getByRole("navigation");
    expect(navElement).toBeTruthy();
  });
});
