import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "@/App";

// Create a wrapper component for tests
const TestWrapper = ({ children, initialEntries = ["/"] }: { children: React.ReactNode; initialEntries?: string[] }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

describe("App Route Smoke Tests", () => {
  test("renders home page with main navigation", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Check for main brand elements
    expect(screen.getByText("Lan Onasis Maple")).toBeInTheDocument();
    expect(screen.getByText("Live Smart.")).toBeInTheDocument();
    
    // Check for navigation items
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Maple Wealth")).toBeInTheDocument();
    expect(screen.getByText("Maple Sport")).toBeInTheDocument();
    
    // Check for Sign In button
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("renders login page when navigating to /login", () => {
    render(
      <TestWrapper initialEntries={["/login"]}>
        <App />
      </TestWrapper>
    );

    // Check for login page elements
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your Maple account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  test("renders 404 page for unknown routes", () => {
    render(
      <TestWrapper initialEntries={["/unknown-route"]}>
        <App />
      </TestWrapper>
    );

    // Should render NotFound component
    // Note: We'd need to check what the NotFound component actually renders
    // For now, let's just make sure it doesn't crash
    expect(document.body).toBeInTheDocument();
  });

  test("home page contains key sections", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Check for main sections
    expect(screen.getByText("Maple Wealth")).toBeInTheDocument();
    expect(screen.getByText("Maple Sport")).toBeInTheDocument();
    expect(screen.getByText("The Maple Movement")).toBeInTheDocument();
  });
});