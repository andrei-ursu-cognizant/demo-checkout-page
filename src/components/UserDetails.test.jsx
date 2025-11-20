import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDetails from "./UserDetails";

describe("UserDetails Component", () => {
  const defaultProps = {
    data: { firstName: "", lastName: "", email: "", phone: "" },
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<UserDetails {...defaultProps} />);
    expect(screen.getByText("Your details")).toBeInTheDocument();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders confirm and cancel buttons", () => {
    render(<UserDetails {...defaultProps} />);
    expect(screen.getByText(/CONFIRM DETAILS/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it("shows Required indicator for all fields", () => {
    render(<UserDetails {...defaultProps} />);
    const requiredLabels = screen.getAllByText("Required");
    expect(requiredLabels.length).toBe(4);
  });

  it("populates fields with provided data", () => {
    const data = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
    };
    render(<UserDetails {...defaultProps} data={data} />);
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("shows error when confirming with empty fields", () => {
    render(<UserDetails {...defaultProps} />);
    const confirmButton = screen.getByText(/CONFIRM DETAILS/i);
    fireEvent.click(confirmButton);
    expect(
      screen.getByText(/Please fill all required fields/i)
    ).toBeInTheDocument();
  });

  it("calls onConfirm with form data when all fields are filled", async () => {
    render(<UserDetails {...defaultProps} />);
    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "Jane");
    await userEvent.type(inputs[1], "Smith");
    await userEvent.type(inputs[2], "jane@example.com");
    await userEvent.type(inputs[3], "9876543210");

    const confirmButton = screen.getByText(/CONFIRM DETAILS/i);
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "9876543210",
    });
  });

  it("clears error message when user starts typing after error", async () => {
    render(<UserDetails {...defaultProps} />);
    const confirmButton = screen.getByText(/CONFIRM DETAILS/i);

    // Try to confirm with empty fields
    fireEvent.click(confirmButton);
    expect(
      screen.getByText(/Please fill all required fields/i)
    ).toBeInTheDocument();

    // Type in a field
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "Test");

    // Error should still be there until all fields are filled
    expect(
      screen.getByText(/Please fill all required fields/i)
    ).toBeInTheDocument();
  });

  it("updates field values as user types", async () => {
    render(<UserDetails {...defaultProps} />);
    const inputs = screen.getAllByRole("textbox");
    const emailInput = inputs[2]; // email is the third input
    await userEvent.type(emailInput, "test@example.com");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("updates from parent data changes", () => {
    const { rerender } = render(<UserDetails {...defaultProps} />);
    const newData = {
      firstName: "Updated",
      lastName: "",
      email: "",
      phone: "",
    };
    rerender(<UserDetails data={newData} onConfirm={defaultProps.onConfirm} />);
    expect(screen.getByDisplayValue("Updated")).toBeInTheDocument();
  });
});
