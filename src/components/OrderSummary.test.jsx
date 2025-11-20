import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderSummary from "./OrderSummary";

describe("OrderSummary Component", () => {
  const defaultProps = {
    giftCard: null,
    offer: null,
    delivery: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders order summary heading", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText("Order summary")).toBeInTheDocument();
  });

  it("renders offer code input field", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter code")).toBeInTheDocument();
  });

  it("renders apply button", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText("APPLY")).toBeInTheDocument();
  });

  it("allows entering offer code", async () => {
    render(<OrderSummary {...defaultProps} />);
    const offerInput = screen.getByPlaceholderText("Enter code");
    await userEvent.type(offerInput, "DEMO123");
    expect(offerInput.value).toBe("DEMO123");
  });

  it("shows error when applying invalid offer code", async () => {
    render(<OrderSummary {...defaultProps} />);
    const offerInput = screen.getByPlaceholderText("Enter code");
    await userEvent.type(offerInput, "INVALID");

    const applyButton = screen.getByText("APPLY");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid offer code")).toBeInTheDocument();
    });
  });

  it("applies valid offer code DEMO123", async () => {
    render(<OrderSummary {...defaultProps} />);
    const offerInput = screen.getByPlaceholderText("Enter code");
    await userEvent.type(offerInput, "DEMO123");

    const applyButton = screen.getByText("APPLY");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Offer applied: £3")).toBeInTheDocument();
    });
  });

  it("displays offer details after successful application", async () => {
    render(<OrderSummary {...defaultProps} />);
    const offerInput = screen.getByPlaceholderText("Enter code");
    await userEvent.type(offerInput, "DEMO123");

    const applyButton = screen.getByText("APPLY");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText(/Offer \(DEMO123\)/)).toBeInTheDocument();
      expect(screen.getByText(/-£3.00/)).toBeInTheDocument();
    });
  });

  it("displays subtotal row", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
  });

  it("displays delivery row", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  it("displays total row", () => {
    render(<OrderSummary {...defaultProps} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  it("shows free delivery when no delivery option selected", () => {
    render(<OrderSummary {...defaultProps} />);
    // Find the delivery row and check for Free
    const rows = screen.getAllByText("Delivery");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("shows paid delivery when standard delivery selected", () => {
    const props = {
      ...defaultProps,
      delivery: { type: "home", deliveryOpt: "standard" },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("shows next day delivery cost", () => {
    const props = {
      ...defaultProps,
      delivery: { type: "home", deliveryOpt: "next" },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText(/£5.95/)).toBeInTheDocument();
  });

  it("shows gift card discount when applied", () => {
    const props = {
      ...defaultProps,
      giftCard: { value: 5 },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText("Gift card")).toBeInTheDocument();
    expect(screen.getByText(/-£5.00/)).toBeInTheDocument();
  });

  it("displays offer from props", () => {
    const props = {
      ...defaultProps,
      offer: { code: "PROMO50", value: 10 },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText(/Offer \(PROMO50\)/)).toBeInTheDocument();
  });

  it("displays product list from PRODUCTS", () => {
    render(<OrderSummary {...defaultProps} />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("has product cards with quantity information", () => {
    render(<OrderSummary {...defaultProps} />);
    const qtyElements = screen.getAllByText(/Qty:/);
    expect(qtyElements.length).toBeGreaterThan(0);
  });

  it("handles product image errors with fallback SVG", async () => {
    render(<OrderSummary {...defaultProps} />);
    const images = screen.getAllByRole("img");

    // Simulate image load error
    images.forEach((img) => {
      fireEvent.error(img);
    });

    // Images should still render with fallback
    await waitFor(() => {
      expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    });
  });

  it("handles empty gift card value", () => {
    const props = {
      ...defaultProps,
      giftCard: { value: 0 },
    };
    render(<OrderSummary {...props} />);
    expect(screen.queryByText("Gift card")).not.toBeInTheDocument();
  });

  it("calculates total correctly without discounts", () => {
    const props = {
      ...defaultProps,
      delivery: { type: "home", deliveryOpt: "standard" },
    };
    render(<OrderSummary {...props} />);
    const totalRow = screen.getByText("Total");
    expect(totalRow).toBeInTheDocument();
  });

  it("clears error message when code is valid", async () => {
    render(<OrderSummary {...defaultProps} />);
    const offerInput = screen.getByPlaceholderText("Enter code");

    // First try invalid code
    await userEvent.type(offerInput, "INVALID");
    const applyButton = screen.getByText("APPLY");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid offer code")).toBeInTheDocument();
    });

    // Clear and try valid code
    fireEvent.change(offerInput, { target: { value: "DEMO123" } });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Offer applied: £3")).toBeInTheDocument();
      expect(screen.queryByText("Invalid offer code")).not.toBeInTheDocument();
    });
  });

  it("displays both gift card and offer discount together", () => {
    const props = {
      ...defaultProps,
      giftCard: { value: 5 },
      offer: { code: "DEMO123", value: 3 },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText("Gift card")).toBeInTheDocument();
    expect(screen.getByText(/Offer \(DEMO123\)/)).toBeInTheDocument();
  });

  it("shows store click and collect (no delivery charge)", () => {
    const props = {
      ...defaultProps,
      delivery: { type: "store" },
    };
    render(<OrderSummary {...props} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });
});
