import { describe, test, expect } from "bun:test";
import React from "react";
import { renderToString } from "react-dom/server";
import { Button } from "@/components/ui/button";

describe("UI Smoke Tests (SSR)", () => {
  test("Button renders children correctly via SSR", () => {
    const html = renderToString(<Button>Click Me</Button>);
    expect(html).toContain("Click Me");
    expect(html).toContain("button");
  });
});
