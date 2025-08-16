import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

// Mock the auth gateway
vi.mock("@/integrations/auth/gateway", () => ({
  loginInline: vi.fn(),
  logout: vi.fn(),
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
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

describe("Login Flow Tests", () => {
  test("Login page renders form elements", () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    // Check for essential login form elements
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to your Maple account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  test("Login form handles user input", async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("Login form submission calls loginInline", async () => {
    const { loginInline } = require("@/integrations/auth/gateway");
    loginInline.mockResolvedValue({ access_token: "test-token" });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(loginInline).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  test("Login form shows error on failed login", async () => {
    const { loginInline } = require("@/integrations/auth/gateway");
    loginInline.mockRejectedValue(new Error("Login failed"));

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );
    
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign In" });
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Login failed. Please check your credentials and try again.")).toBeInTheDocument();
    });
  });
});