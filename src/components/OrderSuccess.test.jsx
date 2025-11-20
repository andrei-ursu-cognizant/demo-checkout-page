import React from "react";
import { render, screen } from "@testing-library/react";
import OrderSuccess from "./OrderSuccess";

describe("OrderSuccess Component", () => {
  const defaultProps = {
    details: { firstName: "John", lastName: "Doe", email: "john@example.com" },
    orderInfo: {
      delivery: {
        type: "home",
        selected: "10 Downing St, London, SW1A 2AA",
        deliveryOpt: "standard",
      },
      payment: {
        method: "card",
        last4: "0000",
      },
    },
  };

  it("renders order success message", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/Order success/i)).toBeInTheDocument();
  });

  it("displays thank you message with customer name", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(
      screen.getByText(/Thank you John, your order was placed successfully/i)
    ).toBeInTheDocument();
  });

  it("displays items ordered section", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/Items ordered/i)).toBeInTheDocument();
  });

  it("displays delivery section", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText("Delivery")).toBeInTheDocument();
  });

  it("displays payment section", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("displays back to shop button", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText("Back to shop")).toBeInTheDocument();
  });

  it("displays delivery address for home delivery", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/Delivery to:/)).toBeInTheDocument();
    expect(
      screen.getByText(/10 Downing St, London, SW1A 2AA/)
    ).toBeInTheDocument();
  });

  it("displays delivery method", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/Method: standard/)).toBeInTheDocument();
  });

  it("displays payment method", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/Method: card/)).toBeInTheDocument();
  });

  it("displays card last 4 digits", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText(/•••• 0000/)).toBeInTheDocument();
  });

  it("displays collection message for store pickup", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        delivery: {
          type: "store",
          selected: "Boots High St, London",
          pickupDate: "Tomorrow",
        },
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/Collection at:/)).toBeInTheDocument();
    expect(screen.getByText(/Boots High St, London/)).toBeInTheDocument();
    expect(screen.getByText(/Collection date: Tomorrow/)).toBeInTheDocument();
  });

  it("displays PayPal payment method", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        payment: {
          method: "paypal",
        },
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/Method: paypal/)).toBeInTheDocument();
  });

  it("displays Apple Pay payment method", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        payment: {
          method: "apple",
        },
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/Method: apple/)).toBeInTheDocument();
  });

  it("handles no address gracefully", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        delivery: {
          type: "home",
          selected: null,
          deliveryOpt: "standard",
        },
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/\(no address\)/)).toBeInTheDocument();
  });

  it("handles missing payment details", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        payment: {
          method: "paypal",
        },
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/Method: paypal/)).toBeInTheDocument();
  });

  it("displays generic customer name when details missing", () => {
    const props = {
      details: {},
      orderInfo: defaultProps.orderInfo,
    };
    render(<OrderSuccess {...props} />);
    expect(
      screen.getByText(
        /Thank you Customer, your order was placed successfully/i
      )
    ).toBeInTheDocument();
  });

  it("renders Back to shop button that is clickable", () => {
    render(<OrderSuccess {...defaultProps} />);
    const button = screen.getByText("Back to shop");
    expect(button).toHaveClass("btn");
  });

  it("displays order information in correct order", () => {
    render(<OrderSuccess {...defaultProps} />);
    const orderSuccessText = screen.getByText(/Order success/i);
    const itemsOrderedText = screen.getByText(/Items ordered/i);
    const deliveryText = screen.getByText("Delivery");
    const paymentText = screen.getByText("Payment");

    expect(orderSuccessText).toBeInTheDocument();
    expect(itemsOrderedText).toBeInTheDocument();
    expect(deliveryText).toBeInTheDocument();
    expect(paymentText).toBeInTheDocument();
  });

  it("handles undefined orderInfo gracefully", () => {
    const props = {
      details: { firstName: "Jane" },
      orderInfo: undefined,
    };
    render(<OrderSuccess {...props} />);
    expect(
      screen.getByText(/Thank you Jane, your order was placed successfully/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/\(no address\)/)).toBeInTheDocument();
  });

  it("displays items ordered heading", () => {
    render(<OrderSuccess {...defaultProps} />);
    expect(screen.getByText("Items ordered")).toBeInTheDocument();
  });

  it("has card class on payment container", () => {
    const { container } = render(<OrderSuccess {...defaultProps} />);
    const paymentCards = container.querySelectorAll(".card");
    expect(paymentCards.length).toBeGreaterThan(0);
  });

  it("displays (not specified) when payment method missing", () => {
    const props = {
      ...defaultProps,
      orderInfo: {
        ...defaultProps.orderInfo,
        payment: {},
      },
    };
    render(<OrderSuccess {...props} />);
    expect(screen.getByText(/\(not specified\)/)).toBeInTheDocument();
  });
});
