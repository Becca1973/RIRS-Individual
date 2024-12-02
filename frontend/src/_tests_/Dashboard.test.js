import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Dashboard";
import { getUserRequests } from "../api/requestApi";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

jest.mock("../api/requestApi", () => ({
  getUserRequests: jest.fn(),
}));

describe("Dashboard", () => {
  beforeEach(async () => {
    await getUserRequests.mockResolvedValue([
      {
        dopusti: [
          {
            tip_dopusta: "Vacation Leave",
            zacetek: "2023-12-01",
            konec: "2023-12-05",
          },
        ],
      },
    ]);
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
});
