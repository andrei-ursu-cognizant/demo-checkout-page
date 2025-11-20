import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header Component", () => {
  it("renders the checkout title", () => {
    render(<Header />);
    expect(screen.getByText("Checkout")).toBeInTheDocument();
  });

  it("renders inside a header element with correct class", () => {
    const { container } = render(<Header />);
    const headerDiv = container.querySelector(".header");
    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass("header");
  });

  it("renders h1 with correct styling", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Checkout");
  });
});
