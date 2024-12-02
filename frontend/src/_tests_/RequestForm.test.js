import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestForm from "../components/RequestForm";
import "@testing-library/jest-dom";

jest.mock("../api/requestApi", () => ({
  submitLeaveRequest: jest.fn().mockResolvedValue({ status: 201 }),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

test("renders leave request form", () => {
  render(<RequestForm />);
  expect(screen.getByText(/Leave Request Form/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /Submit Request/i })
  ).toBeInTheDocument();
});

test("adds a new leave request field", async () => {
  render(<RequestForm />);

  expect(screen.getAllByLabelText(/Reason/i).length).toBe(1);

  await userEvent.click(screen.getByText(/Add Another Leave/i));

  await waitFor(() => {
    expect(screen.getAllByLabelText(/Reason/i).length).toBe(2);
  });
});

test("removes a leave request field", async () => {
  render(<RequestForm />);

  expect(screen.getAllByLabelText(/Reason/i).length).toBe(1);

  await userEvent.click(screen.getByText(/Add Another Leave/i));

  await waitFor(() => {
    expect(screen.getAllByLabelText(/Reason/i).length).toBe(2);
  });

  const deleteButton = screen.getAllByRole("button", {
    name: /Delete leave/i,
  })[0];
  await userEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.getAllByLabelText(/Reason/i).length).toBe(1);
  });
});

test("validates that start date is before end date", async () => {
  render(<RequestForm />);

  const startDateInput = screen.getAllByLabelText(/Start Date/i)[0];
  const endDateInput = screen.getAllByLabelText(/End Date/i)[0];

  await userEvent.type(startDateInput, "2024-12-02");
  await userEvent.type(endDateInput, "2024-11-30");

  await userEvent.click(screen.getByText(/Submit Request/i));

  await waitFor(() => {
    expect(
      screen.getByText(/Start date must be before the end date/i)
    ).toBeInTheDocument();
  });
});

test("submitting a valid leave request shows success message", async () => {
  render(<RequestForm />);

  // Fill out the form with valid data
  const startDateInput = screen.getAllByLabelText(/Start Date/i)[0];
  const endDateInput = screen.getAllByLabelText(/End Date/i)[0];
  const reasonInput = screen.getAllByLabelText(/Reason/i)[0];
  const leaveTypeInput = screen.getByRole("combobox", { name: /Leave Type/i });

  // Fill in valid data for the leave request
  await userEvent.type(startDateInput, "2024-12-01");
  await userEvent.type(endDateInput, "2024-12-10");
  await userEvent.type(reasonInput, "Vacation");

  // Open the dropdown using userEvent.click
  userEvent.click(leaveTypeInput); // Simulate a click to open the dropdown

  // Wait for the options to be visible and select "Vacation Leave" by value "1"
  const vacationLeaveOption = await screen.findByRole("option", {
    name: /Vacation Leave/i,
  });
  userEvent.click(vacationLeaveOption); // Click the option to select it

  // Submit the form
  userEvent.click(screen.getByText(/Submit Request/i));

  // Wait for the success message
  await waitFor(() => {
    expect(
      screen.getByText(/Request submitted successfully!/i)
    ).toBeInTheDocument();
  });

  // Check if the form is reset
  await (() => {
    expect(startDateInput.value).toBe("");
    expect(endDateInput.value).toBe("");
    expect(reasonInput.value).toBe("");
    expect(leaveTypeInput.value).toBe(""); // Ensure the value is reset to empty
  });
});
