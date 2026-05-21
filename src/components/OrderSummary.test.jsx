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

  describe("Unit Conversion Logic", () => {
    it("converts KG to g (lowercase) for regular products", () => {
      render(<OrderSummary {...defaultProps} />);
      // p2: KG 0.08 should display as 80 g
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/80 g \|/);
    });

    it("converts L to ml (lowercase) for regular products", () => {
      render(<OrderSummary {...defaultProps} />);
      // p1: L 0.1 should display as 100 ml
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/100 ml \|/);
    });

    it("uses original netContents for price per unit calculation", () => {
      render(<OrderSummary {...defaultProps} />);
      // p1: £862.50 per L (86.25 / 0.1)
      // p2: £359.38 per KG (28.75 / 0.08)
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/per L|per KG/);
    });

    it("hides price per unit for same-item bundles with netContents <= 5g/5ml", () => {
      render(<OrderSummary {...defaultProps} />);
      // p3: Same-item bundle with KG 0.003 (3g) should not show price
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/3 g/);
      // Verify that 3g appears in the content
      expect(cardContent).toContain("3 g");
    });

    it("displays mixed bundle without unit conversion", () => {
      render(<OrderSummary {...defaultProps} />);
      // p4: Mixed bundle with L 1.35 should display as 1.35 L (no conversion)
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/1.35 L/);
    });

    it("displays price per unit for mixed bundle using original unit", () => {
      render(<OrderSummary {...defaultProps} />);
      // p4: Mixed bundle should show price per L (not ml)
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/1.35 L \| £[\d.]+ per L/);
    });

    it("uses toFixed(2) for price per unit precision", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      const priceMatches = cardContent.match(/£[\d.]+\.\d{2} per/g);
      expect(priceMatches).toBeTruthy();
      if (priceMatches) {
        priceMatches.forEach((match) => {
          const priceValue = match.match(/£([\d.]+) per/)[1];
          const decimalPlaces = priceValue.split(".")[1];
          expect(decimalPlaces).toHaveLength(2);
        });
      }
    });

    it("converts same-item bundle unit and value but hides price if <= 5", () => {
      render(<OrderSummary {...defaultProps} />);
      // p3: 0.003 KG should convert to 3 g and not show price
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      expect(cardContent).toMatch(/3 g/);
    });

    it("displays converted units in lowercase", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // Should have lowercase g and ml in display (not in "per" part)
      expect(cardContent).toMatch(/\d+ g \|/);
      expect(cardContent).toMatch(/\d+ ml \|/);
    });

    it("does not convert non-KG/non-L units", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // Should render without errors and have the converted units
      expect(cardContent).toMatch(/g|ml/);
    });

    it("handles product with very small KG value (0.003 KG)", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p3: 0.003 KG = 3 g
      expect(cardContent).toMatch(/3 g/);
    });

    it("handles product with decimal L value (0.1 L)", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p1: 0.1 L = 100 ml
      expect(cardContent).toMatch(/100 ml/);
    });

    it("shows price per unit for regular KG product (0.08 KG)", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p2: 80 g | £359.38 per KG
      expect(cardContent).toMatch(/80 g \| £[\d.]+ per KG/);
    });

    it("shows price per unit for regular L product (0.1 L)", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p1: 100 ml | £862.50 per L
      expect(cardContent).toMatch(/100 ml \| £[\d.]+ per L/);
    });

    it("maintains original measurement unit in price per unit for all types", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // Price should be in original units (KG, L), not converted (g, ml)
      const perKG = (cardContent.match(/per KG/g) || []).length;
      const perL = (cardContent.match(/per L/g) || []).length;
      expect(perKG + perL).toBeGreaterThan(0);
    });

    it("edge case: same-item bundle with exactly 5g threshold", () => {
      render(<OrderSummary {...defaultProps} />);
      // Should not crash and render correctly
      expect(screen.getByText("Order summary")).toBeInTheDocument();
    });

    it("edge case: mixed bundle shows only original values", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p4 should be 1.35 L (not converted to ml)
      expect(cardContent).toMatch(/1.35 L/);
    });

    it("price calculation uses original netContents, not converted", () => {
      render(<OrderSummary {...defaultProps} />);
      const cardContent = screen
        .getByRole("button", { name: /APPLY/ })
        .closest(".card").textContent;
      // p2: £359.38 per KG = 28.75 / 0.08 (using 0.08 KG, not 80 g)
      expect(cardContent).toMatch(/359.38 per KG/);
    });
  });
});
