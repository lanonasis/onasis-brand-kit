import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  test("renders with correct text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
  });

  test("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole("button", { name: "Click Me" });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("can be disabled", () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });

  test("applies variant classes correctly", () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole("button", { name: "Outline Button" });
    expect(button).toHaveClass("border");
  });

  test("applies size classes correctly", () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole("button", { name: "Small Button" });
    expect(button).toHaveClass("h-9");
  });

  test("supports custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    
    const button = screen.getByRole("button", { name: "Custom Button" });
    expect(button).toHaveClass("custom-class");
  });

  test("renders as child element when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole("link", { name: "Link Button" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  test("has proper accessibility attributes", () => {
    render(<Button aria-label="Close dialog">×</Button>);
    
    const button = screen.getByLabelText("Close dialog");
    expect(button).toBeInTheDocument();
  });
});