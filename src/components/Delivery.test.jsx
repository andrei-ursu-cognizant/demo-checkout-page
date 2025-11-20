import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Delivery from "./Delivery";

describe("Delivery Component", () => {
  const defaultProps = {
    data: { type: "home" },
    onSelect: jest.fn(),
    onContinue: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders delivery tabs", () => {
    const { container } = render(<Delivery {...defaultProps} />);
    const tabs = container.querySelectorAll(".tab");
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders click and collect option", () => {
    render(<Delivery {...defaultProps} />);
    expect(screen.getByText("Click & Collect")).toBeInTheDocument();
  });

  it("shows postcode input when no address selected", () => {
    render(<Delivery {...defaultProps} />);
    expect(
      screen.getByPlaceholderText(/Enter postcode or city/i)
    ).toBeInTheDocument();
  });

  it("opens modal when postcode input is focused", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find an address/i)).toBeInTheDocument();
    });
  });

  it("shows suggestions after typing 3+ characters in modal", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lon");

    await waitFor(() => {
      expect(screen.getByText(/10 Downing St/)).toBeInTheDocument();
    });
  });

  it("does not show suggestions with less than 3 characters", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lo");

    // Suggestions should not appear
    expect(screen.queryByText(/10 Downing St/)).not.toBeInTheDocument();
  });

  it("selects address from suggestions and confirms", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lon");

    await waitFor(() => {
      expect(screen.getByText(/10 Downing St/)).toBeInTheDocument();
    });

    const addressOption = screen.getByText(/10 Downing St/);
    fireEvent.click(addressOption);

    const confirmButton = screen.getByText(/Confirm address/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalled();
    });
  });

  it("closes modal when cancel is clicked", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find an address/i)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Find an address/i)).not.toBeInTheDocument();
    });
  });

  it("closes modal when clicking outside overlay", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find an address/i)).toBeInTheDocument();
    });

    const overlay = document.querySelector(".modal-overlay");
    fireEvent.click(overlay);

    await waitFor(() => {
      expect(screen.queryByText(/Find an address/i)).not.toBeInTheDocument();
    });
  });

  it("shows delivery address label for home tab", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lon");

    await waitFor(() => {
      expect(screen.getByText(/10 Downing St/)).toBeInTheDocument();
    });

    const addressOption = screen.getByText(/10 Downing St/);
    fireEvent.click(addressOption);

    const confirmButton = screen.getByText(/Confirm address/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/Delivery address/i)).toBeInTheDocument();
    });
  });

  it("shows store address label for store tab", async () => {
    render(<Delivery {...defaultProps} />);
    const storeTab = screen.getByText("Click & Collect");
    fireEvent.click(storeTab);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ type: "store" })
      );
    });

    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find a store/i)).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lon");

    await waitFor(() => {
      expect(screen.getByText(/Boots High St/)).toBeInTheDocument();
    });

    const storeOption = screen.getByText(/Boots High St/);
    fireEvent.click(storeOption);

    const confirmButton = screen.getByText(/Confirm store/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/Store address/i)).toBeInTheDocument();
    });
  });

  it("displays selected address with Edit button", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);
    expect(
      screen.getByText(/10 Downing St, London, SW1A 2AA/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Edit this address/i)).toBeInTheDocument();
  });

  it("shows delivery method options for home tab", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);
    expect(screen.getByLabelText(/Standard Delivery/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Next Day Delivery/i)).toBeInTheDocument();
  });

  it("shows continue to gift card button when address selected", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);
    expect(screen.getByText(/Continue to gift card/i)).toBeInTheDocument();
  });

  it("calls onContinue when continue button clicked", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);
    const continueButton = screen.getByText(/Continue to gift card/i);
    fireEvent.click(continueButton);
    expect(defaultProps.onContinue).toHaveBeenCalled();
  });

  it("clears selection when edit address is clicked", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);
    const editButton = screen.getByText(/Edit this address/i);
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ selected: null })
      );
    });
  });

  it("maintains separate selections per tab", async () => {
    render(<Delivery {...defaultProps} />);

    // Select home address
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "lon");

    await waitFor(() => {
      expect(screen.getByText(/10 Downing St/)).toBeInTheDocument();
    });

    const addressOption = screen.getByText(/10 Downing St/);
    fireEvent.click(addressOption);

    const confirmButton = screen.getByText(/Confirm address/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/Delivery address/i)).toBeInTheDocument();
    });

    // Switch to store tab
    const storeTab = screen.getByText("Click & Collect");
    fireEvent.click(storeTab);

    await waitFor(() => {
      // Store selection should be empty
      expect(
        screen.getByPlaceholderText(/Enter postcode or city/i)
      ).toBeInTheDocument();
    });
  });

  it("can change delivery method radio selection", async () => {
    const props = {
      ...defaultProps,
      data: { type: "home", selected: "10 Downing St, London, SW1A 2AA" },
    };
    render(<Delivery {...props} />);

    const standardRadio = screen.getByLabelText(/Standard Delivery/i);
    const nextDayRadio = screen.getByLabelText(/Next Day Delivery/i);

    expect(standardRadio).toBeChecked();
    fireEvent.click(nextDayRadio);
    expect(nextDayRadio).toBeChecked();
  });

  it("closes modal when X button is clicked", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find an address/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/Find an address/i)).not.toBeInTheDocument();
    });
  });

  it("does not confirm selection without entering text or selecting", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      expect(screen.getByText(/Find an address/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByText(/Confirm address/i);
    fireEvent.click(confirmButton);

    // onSelect should not be called with empty address
    expect(defaultProps.onSelect).not.toHaveBeenCalledWith(
      expect.objectContaining({ selected: "" })
    );
  });

  it("confirms modal selection with manually typed address", async () => {
    render(<Delivery {...defaultProps} />);
    const postcodeInput = screen.getByPlaceholderText(
      /Enter postcode or city/i
    );
    fireEvent.focus(postcodeInput);

    await waitFor(() => {
      const modalInput = screen.getByPlaceholderText(
        /Enter post code or place/i
      );
      expect(modalInput).toBeInTheDocument();
    });

    const modalInput = screen.getByPlaceholderText(/Enter post code or place/i);
    await userEvent.type(modalInput, "Custom Address, London");

    const confirmButton = screen.getByText(/Confirm address/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ selected: "Custom Address, London" })
      );
    });
  });

  it("shows store pickup date options for store tab", async () => {
    const props = {
      ...defaultProps,
      data: { type: "store", selected: "Boots High St, London" },
    };
    render(<Delivery {...props} />);

    expect(screen.getByText(/Pick a collection date/i)).toBeInTheDocument();
  });

  it("can render store delivery with selected pickup date", async () => {
    const props = {
      ...defaultProps,
      data: {
        type: "store",
        selected: "Boots High St, London",
        pickupDate: "Tomorrow",
      },
    };
    render(<Delivery {...props} />);

    expect(screen.getByText(/Boots High St, London/)).toBeInTheDocument();
  });
});
