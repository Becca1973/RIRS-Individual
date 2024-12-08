import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import userEvent from "@testing-library/user-event";
import { deleteLeave } from "../api/requestApi";

import "@testing-library/jest-dom";

jest.mock("../api/requestApi", () => ({
  deleteLeave: jest.fn().mockResolvedValue({ success: true }), // Mockira funkcijo, ki vrača uspeh
  getUserRequests: jest.fn().mockResolvedValue([
    {
      dopusti: [
        {
          id: "1", // Primer ID-ja dopusta
          tip_dopusta: "Vacation Leave",
          zacetek: "2023-12-01",
          konec: "2023-12-05",
        },
      ],
    },
  ]),
}));

describe("Dashboard", () => {
  let confirmSpy;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  test("renders loading spinner initially and displays data after fetch", async () => {
    render(<Dashboard />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });
  });

  test("filters requests by leave type", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    userEvent.click(selectElement);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Vacation Leave"));

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });
  });

  test("displays 'All Types' when no filter is selected", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    userEvent.click(selectElement);

    const allTypesOption = await screen.findByRole("option", {
      name: /All Types/i,
    });

    userEvent.click(allTypesOption);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });
  });

  test("displays confirmation dialog when delete button is clicked", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  test("removes leave from the list after successful deletion", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText("Vacation Leave")).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteLeave).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(screen.queryByText("Vacation Leave")).not.toBeInTheDocument();
    });
  });
});
