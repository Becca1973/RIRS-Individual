import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LeavesTable from "../components/LeavesTable";
import "@testing-library/jest-dom";

test("sorts leave requests by start date", () => {
  const leaves = [
    {
      ime: "test123",
      priimek: "test123",
      zacetek: "2024-01-02",
      konec: "2024-01-05",
      tip_dopusta: "Vacation Leave",
    },
    {
      ime: "Test",
      priimek: "Test",
      zacetek: "2024-01-01",
      konec: "2024-01-04",
      tip_dopusta: "Sick Leave",
    },
  ];
  render(<LeavesTable leaves={leaves} />);

  const rows = screen.getAllByRole("row");

  expect(rows[1].cells[0].textContent).toMatch(/Test/);
  expect(rows[1].cells[1].textContent).toMatch(/Test/);

  expect(rows[2].cells[0].textContent).toMatch(/test123/);
  expect(rows[2].cells[1].textContent).toMatch(/test123/);
});

test("filters leave requests by name", () => {
  const leaves = [
    {
      ime: "test123",
      priimek: "test123",
      zacetek: "2024-01-01",
      konec: "2024-01-05",
      tip_dopusta: "Vacation Leave",
    },
  ];
  render(<LeavesTable leaves={leaves} />);

  const searchInput = screen.getByLabelText(/Search/i);
  userEvent.type(searchInput, "Test");

  const leaveRequest = screen.queryByText(/test123 test123/i);
  expect(leaveRequest).not.toBeInTheDocument();
});
