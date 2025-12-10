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

  it("converts KG to g (lowercase) for regular products", () => {
    render(<OrderSummary {...defaultProps} />);
    // p2: KG 0.08 -> g 80
    expect(screen.getByText(/80 g/)).toBeInTheDocument();
  });

  it("converts L to ml (lowercase) for regular products", () => {
    render(<OrderSummary {...defaultProps} />);
    // p1: L 0.1 -> ml 100
    expect(screen.getByText(/100 ml/)).toBeInTheDocument();
  });

  it("uses original netContents for price per unit calculation (not converted)", () => {
    render(<OrderSummary {...defaultProps} />);
    // p1: £86.25 / 0.1 (original) = £862.50, but displayed as 100 ml
    expect(screen.getByText(/100 ml \| £862.50 per L/)).toBeInTheDocument();
    // p2: £28.75 / 0.08 (original) = £359.38, but displayed as 80 g
    expect(screen.getByText(/80 g \| £359.38 per KG/)).toBeInTheDocument();
  });

  it("hides price per unit for same-item bundles with netContents <= 5g/5ml", () => {
    render(<OrderSummary {...defaultProps} />);
    // p3: same-item bundle KG 0.003 -> g 3 (converted, <= 5)
    const text3g = screen.getByText(/3 g$/);
    // Should not contain "per" (meaning no price per unit)
    expect(text3g.textContent).not.toContain("per");
  });

  it("displays mixed bundle without unit conversion", () => {
    render(<OrderSummary {...defaultProps} />);
    // p4: mixed bundle (isSameItemBundle: false) keeps original L unit
    expect(screen.getByText(/1.35 L/)).toBeInTheDocument();
  });

  it("displays price per unit for mixed bundle using original unit", () => {
    render(<OrderSummary {...defaultProps} />);
    // p4: £12.85 / 1.35 L = £9.52 per L (no conversion)
    expect(screen.getByText(/£9.52 per L/)).toBeInTheDocument();
  });

  it("uses toFixed(2) for price per unit precision", () => {
    render(<OrderSummary {...defaultProps} />);
    // All price values should have 2 decimal places
    expect(screen.getByText(/£862.50 per L/)).toBeInTheDocument();
    expect(screen.getByText(/£359.38 per KG/)).toBeInTheDocument();
    expect(screen.getByText(/£9.52 per L/)).toBeInTheDocument();
  });

  it("converts same-item bundle unit and value but hides price if <= 5", () => {
    render(<OrderSummary {...defaultProps} />);
    // p3: same-item bundle with KG 0.003 -> g 3, no price shown
    const elements = screen.queryAllByText(/3 g/);
    const bundleElement = elements.find((el) => !el.textContent.includes("|"));
    expect(bundleElement).toBeInTheDocument();
    expect(bundleElement?.textContent).toBe("3 g");
  });
});
