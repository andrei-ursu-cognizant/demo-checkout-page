import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Stepper from "./Stepper";

describe("Stepper Component", () => {
  const defaultProps = {
    step: 0,
    setStep: jest.fn(),
    expandedSteps: [0],
    setExpandedSteps: jest.fn(),
    panels: [
      <div key="0">Panel 0</div>,
      <div key="1">Panel 1</div>,
      <div key="2">Panel 2</div>,
      <div key="3">Panel 3</div>,
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all four steps", () => {
    render(<Stepper {...defaultProps} />);
    expect(screen.getByText("Your details")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Gift card")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("displays step numbers for non-completed steps", () => {
    render(<Stepper {...defaultProps} />);
    const circles = screen.getAllByText(/[1-4]/);
    expect(circles.length).toBeGreaterThan(0);
  });

  it("displays checkmark for completed steps", () => {
    const props = { ...defaultProps, step: 2 };
    render(<Stepper {...props} />);
    // Steps 0 and 1 should show checkmarks
    const checkmarks = screen.getAllByText("✓");
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it("renders panels when expanded", () => {
    render(<Stepper {...defaultProps} expandedSteps={[0, 1]} />);
    expect(screen.getByText("Panel 0")).toBeInTheDocument();
    expect(screen.getByText("Panel 1")).toBeInTheDocument();
  });

  it("does not render panels when not expanded", () => {
    render(<Stepper {...defaultProps} expandedSteps={[]} />);
    expect(screen.queryByText("Panel 0")).not.toBeInTheDocument();
  });

  it("calls setStep when header is clicked", () => {
    render(<Stepper {...defaultProps} />);
    const headers = screen.getAllByText(
      /Your details|Delivery|Gift card|Payment/
    );
    fireEvent.click(headers[1]); // Click Delivery header
    expect(defaultProps.setStep).toHaveBeenCalledWith(1);
  });

  it("toggles expansion when expand button is clicked", () => {
    render(<Stepper {...defaultProps} />);
    const expandButtons = screen.getAllByText(/−|\+/);
    fireEvent.click(expandButtons[1]); // Click second step's expand button
    // Should call setExpandedSteps with updated array
    expect(defaultProps.setExpandedSteps).toHaveBeenCalled();
  });

  it("applies active class to current step header", () => {
    const { container } = render(<Stepper {...defaultProps} step={1} />);
    const headers = container.querySelectorAll(".stepper-header");
    expect(headers[1]).toHaveClass("active");
  });

  it("applies completed class to steps before current", () => {
    const { container } = render(<Stepper {...defaultProps} step={2} />);
    const headers = container.querySelectorAll(".stepper-header");
    expect(headers[0]).toHaveClass("completed");
    expect(headers[1]).toHaveClass("completed");
  });

  it("stop propagation when clicking expand button prevents navigation", () => {
    const setStep = jest.fn();
    render(<Stepper {...defaultProps} setStep={setStep} expandedSteps={[]} />);
    const expandButtons = screen.getAllByText(/\+/);
    fireEvent.click(expandButtons[0]);
    // Expand click should not trigger setStep
    expect(setStep).not.toHaveBeenCalled();
  });

  it("expands a collapsed step by clicking expand button", () => {
    const setExpandedSteps = jest.fn();
    render(
      <Stepper
        {...defaultProps}
        expandedSteps={[]}
        setExpandedSteps={setExpandedSteps}
      />
    );
    const expandButtons = screen.getAllByText(/\+/);
    fireEvent.click(expandButtons[0]);
    // Should add step 0 to expandedSteps
    expect(setExpandedSteps).toHaveBeenCalledWith([0]);
  });

  it("collapses an expanded step by clicking expand button", () => {
    const setExpandedSteps = jest.fn();
    render(
      <Stepper
        {...defaultProps}
        expandedSteps={[0, 1]}
        setExpandedSteps={setExpandedSteps}
      />
    );
    const expandButtons = screen.getAllByText(/−/);
    fireEvent.click(expandButtons[0]);
    // Should remove step 0 from expandedSteps
    expect(setExpandedSteps).toHaveBeenCalledWith([1]);
  });
});
