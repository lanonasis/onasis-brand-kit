import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthCallback from "@/pages/AuthCallback";

// Mock the auth gateway module
vi.mock("@/integrations/auth/gateway", () => ({
  exchangeCode: vi.fn(),
}));

// Mock react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: vi.fn(),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("AuthCallback Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    // Mock useSearchParams to return empty params
    const { useSearchParams } = require("react-router-dom");
    useSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

    render(
      <TestWrapper>
        <AuthCallback />
      </TestWrapper>
    );

    // Should show loading state
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  test("handles successful auth code exchange", async () => {
    // Mock successful exchange
    const { exchangeCode } = require("@/integrations/auth/gateway");
    const { useSearchParams } = require("react-router-dom");
    
    exchangeCode.mockResolvedValue({ access_token: "test-token" });
    useSearchParams.mockReturnValue([new URLSearchParams("?code=test-code"), vi.fn()]);

    render(
      <TestWrapper>
        <AuthCallback />
      </TestWrapper>
    );

    // Wait for the component to process
    await waitFor(() => {
      expect(exchangeCode).toHaveBeenCalledWith("test-code");
    });
  });

  test("handles auth error", async () => {
    // Mock error in exchange
    const { exchangeCode } = require("@/integrations/auth/gateway");
    const { useSearchParams } = require("react-router-dom");
    
    exchangeCode.mockRejectedValue(new Error("Auth failed"));
    useSearchParams.mockReturnValue([new URLSearchParams("?code=bad-code"), vi.fn()]);

    render(
      <TestWrapper>
        <AuthCallback />
      </TestWrapper>
    );

    // Should handle the error gracefully
    await waitFor(() => {
      expect(exchangeCode).toHaveBeenCalledWith("bad-code");
    });
  });

  test("handles missing code parameter", () => {
    // Mock no code in URL
    const { useSearchParams } = require("react-router-dom");
    useSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

    render(
      <TestWrapper>
        <AuthCallback />
      </TestWrapper>
    );

    // Should handle missing code
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });
});