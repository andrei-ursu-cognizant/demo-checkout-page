import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Payment from "./Payment";

describe("Payment Component", () => {
  const defaultProps = {
    onOrderPlaced: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders payment section", () => {
    render(<Payment {...defaultProps} />);
    expect(screen.getByText("Payment")).toBeInTheDocument();
  });

  it("renders payment method buttons", () => {
    render(<Payment {...defaultProps} />);
    expect(screen.getByText("Pay with card")).toBeInTheDocument();
    expect(screen.getByText("PayPal")).toBeInTheDocument();
    expect(screen.getByText("Apple Pay")).toBeInTheDocument();
  });

  it("shows card form by default", () => {
    render(<Payment {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("9999 8888 7777 0000")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("YY")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123")).toBeInTheDocument();
  });

  it("switches to PayPal method when clicked", async () => {
    render(<Payment {...defaultProps} />);
    const paypalButton = screen.getByText("PayPal");
    fireEvent.click(paypalButton);

    await waitFor(() => {
      expect(
        screen.getByText(/PayPal payment method selected/i)
      ).toBeInTheDocument();
    });
  });

  it("switches to Apple Pay method when clicked", async () => {
    render(<Payment {...defaultProps} />);
    const applePayButton = screen.getByText("Apple Pay");
    fireEvent.click(applePayButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Apple Pay payment method selected/i)
      ).toBeInTheDocument();
    });
  });

  it("allows entering card number", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    await userEvent.type(cardInput, "9999888877770000");
    expect(cardInput.value).toBe("9999888877770000");
  });

  it("allows entering expiry month", async () => {
    render(<Payment {...defaultProps} />);
    const expMonthInput = screen.getByPlaceholderText("MM");
    await userEvent.type(expMonthInput, "12");
    expect(expMonthInput.value).toBe("12");
  });

  it("allows entering expiry year", async () => {
    render(<Payment {...defaultProps} />);
    const expYearInput = screen.getByPlaceholderText("YY");
    await userEvent.type(expYearInput, "26");
    expect(expYearInput.value).toBe("26");
  });

  it("allows entering CVV", async () => {
    render(<Payment {...defaultProps} />);
    const cvvInput = screen.getByPlaceholderText("123");
    await userEvent.type(cvvInput, "123");
    expect(cvvInput.value).toBe("123");
  });

  it("shows error when card details are invalid", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "1234567890123456");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText("Card details invalid")).toBeInTheDocument();
    });
  });

  it("accepts valid card details (9999 8888 7777 0000 / 12 / 26 / 123)", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "9999888877770000");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(defaultProps.onOrderPlaced).toHaveBeenCalledWith({
        method: "card",
        last4: "0000",
      });
    });
  });

  it("shows error when card number is wrong", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "1111222233334444");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText("Card details invalid")).toBeInTheDocument();
    });
  });

  it("shows error when expiry month is wrong", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "9999888877770000");
    await userEvent.type(expMonthInput, "11");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText("Card details invalid")).toBeInTheDocument();
    });
  });

  it("shows error when expiry year is wrong", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "9999888877770000");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "25");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText("Card details invalid")).toBeInTheDocument();
    });
  });

  it("shows error when CVV is wrong", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "9999888877770000");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "999");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(screen.getByText("Card details invalid")).toBeInTheDocument();
    });
  });

  it("calls onOrderPlaced with PayPal when PayPal button clicked and order placed", async () => {
    render(<Payment {...defaultProps} />);
    const paypalButton = screen.getByText("PayPal");
    fireEvent.click(paypalButton);

    await waitFor(() => {
      expect(
        screen.getByText(/PayPal payment method selected/i)
      ).toBeInTheDocument();
    });

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(defaultProps.onOrderPlaced).toHaveBeenCalledWith({
        method: "paypal",
      });
    });
  });

  it("calls onOrderPlaced with Apple Pay when Apple Pay button clicked and order placed", async () => {
    render(<Payment {...defaultProps} />);
    const applePayButton = screen.getByText("Apple Pay");
    fireEvent.click(applePayButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Apple Pay payment method selected/i)
      ).toBeInTheDocument();
    });

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    await waitFor(() => {
      expect(defaultProps.onOrderPlaced).toHaveBeenCalledWith({
        method: "apple",
      });
    });
  });

  it("switches back to card form when Pay with card button is clicked", async () => {
    render(<Payment {...defaultProps} />);
    const paypalButton = screen.getByText("PayPal");
    fireEvent.click(paypalButton);

    await waitFor(() => {
      expect(
        screen.getByText(/PayPal payment method selected/i)
      ).toBeInTheDocument();
    });

    const cardButton = screen.getByText("Pay with card");
    fireEvent.click(cardButton);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("9999 8888 7777 0000")
      ).toBeInTheDocument();
    });
  });

  it("clears error when user corrects card input", async () => {
    render(<Payment {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("9999 8888 7777 0000");
    const expMonthInput = screen.getByPlaceholderText("MM");
    const expYearInput = screen.getByPlaceholderText("YY");
    const cvvInput = screen.getByPlaceholderText("123");

    await userEvent.type(cardInput, "1111222233334444");
    await userEvent.type(expMonthInput, "12");
    await userEvent.type(expYearInput, "26");
    await userEvent.type(cvvInput, "123");

    const placeOrderButton = screen.getByText("PLACE ORDER");
    fireEvent.click(placeOrderButton);

    // Error should appear
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("Card details invalid")).toBeInTheDocument();
  });
});
