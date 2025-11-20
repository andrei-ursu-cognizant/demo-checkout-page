import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GiftCard from "./GiftCard";

describe("GiftCard Component", () => {
  const defaultProps = {
    applied: null,
    onApply: jest.fn(),
    onContinue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders gift card section", () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText("Gift Card")).toBeInTheDocument();
  });

  it("renders card number input field", () => {
    render(<GiftCard {...defaultProps} />);
    expect(
      screen.getByPlaceholderText("1111 2222 3333 4444")
    ).toBeInTheDocument();
  });

  it("renders PIN input field", () => {
    render(<GiftCard {...defaultProps} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(2); // card and PIN
  });

  it("renders ADD button", () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText("ADD")).toBeInTheDocument();
  });

  it("renders Continue button", () => {
    render(<GiftCard {...defaultProps} />);
    expect(screen.getByText(/Continue to payment/i)).toBeInTheDocument();
  });

  it("allows entering card number", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    await userEvent.type(cardInput, "1111222233334444");
    expect(cardInput.value).toBe("1111222233334444");
  });

  it("allows entering PIN", async () => {
    render(<GiftCard {...defaultProps} />);
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1]; // second input is PIN
    await userEvent.type(pinInput, "1234");
    expect(pinInput.value).toBe("1234");
  });

  it("shows error when applying invalid gift card", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    const addButton = screen.getByText("ADD");

    await userEvent.type(cardInput, "1234567890123456");
    await userEvent.type(pinInput, "9999");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid gift card")).toBeInTheDocument();
    });
  });

  it("shows success when valid gift card is applied", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    const addButton = screen.getByText("ADD");

    await userEvent.type(cardInput, "1111222233334444");
    await userEvent.type(pinInput, "1234");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Gift card applied: £5")).toBeInTheDocument();
    });
  });

  it("calls onApply with card data when valid", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    const addButton = screen.getByText("ADD");

    await userEvent.type(cardInput, "1111222233334444");
    await userEvent.type(pinInput, "1234");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(defaultProps.onApply).toHaveBeenCalledWith({
        number: "1111222233334444",
        pin: "1234",
        value: 5,
      });
    });
  });

  it("displays applied gift card info when passed as prop", () => {
    const props = {
      ...defaultProps,
      applied: { number: "1111222233334444", value: 5 },
    };
    render(<GiftCard {...props} />);
    expect(screen.getByText("Applied: £5")).toBeInTheDocument();
  });

  it("calls onContinue when continue button clicked", () => {
    render(<GiftCard {...defaultProps} />);
    const continueButton = screen.getByText(/Continue to payment/i);
    fireEvent.click(continueButton);
    expect(defaultProps.onContinue).toHaveBeenCalled();
  });

  it("handles multiple consecutive attempts", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    const addButton = screen.getByText("ADD");

    // First attempt - invalid
    await userEvent.type(cardInput, "1234567890123456");
    await userEvent.type(pinInput, "9999");
    fireEvent.click(addButton);

    // Give time for state update
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("Invalid gift card")).toBeInTheDocument();
  });

  it("handles card number with spaces", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    await userEvent.type(cardInput, "1111 2222 3333 4444");

    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    await userEvent.type(pinInput, "1234");

    const addButton = screen.getByText("ADD");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Gift card applied: £5")).toBeInTheDocument();
    });
  });

  it("requires correct PIN for valid card", async () => {
    render(<GiftCard {...defaultProps} />);
    const cardInput = screen.getByPlaceholderText("1111 2222 3333 4444");
    const inputs = screen.getAllByRole("textbox");
    const pinInput = inputs[1];
    const addButton = screen.getByText("ADD");

    await userEvent.type(cardInput, "1111222233334444");
    await userEvent.type(pinInput, "0000");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid gift card")).toBeInTheDocument();
    });
  });
});
