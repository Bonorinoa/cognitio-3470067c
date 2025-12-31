import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SlidingPillIndicator } from "./sliding-pill-indicator";

describe("SlidingPillIndicator", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SlidingPillIndicator layoutId="test-indicator" />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("applies rounded-full by default", () => {
    const { container } = render(
      <SlidingPillIndicator layoutId="test-indicator" />
    );
    const element = container.querySelector(".rounded-full");
    expect(element).toBeTruthy();
  });

  it("applies rounded-lg when specified", () => {
    const { container } = render(
      <SlidingPillIndicator layoutId="test-indicator" borderRadius="rounded-lg" />
    );
    const element = container.querySelector(".rounded-lg");
    expect(element).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SlidingPillIndicator
        layoutId="test-indicator"
        className="custom-class"
      />
    );
    const element = container.querySelector(".custom-class");
    expect(element).toBeTruthy();
  });
});
