// src/__tests__/EquipmentListPage.test.js
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EquipmentListPage from "../app/equipment/page";
import api from "../lib/api";

// Mock Navbar and useAuth to avoid context errors
jest.mock("../components/Navbar", () => () => null);
jest.mock("../hooks/useAuth", () => () => ({ user: null }));
jest.mock("../lib/api");

const mockItems = [
  {
    _id: "1",
    name: "Alpha",
    media: { images: [] },
    metadata: { averageRating: 4.2 },
  },
  {
    _id: "2",
    name: "Beta",
    media: { images: [] },
    metadata: { averageRating: 3.5 },
  },
];

describe("EquipmentListPage", () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: { data: { items: mockItems } } });
  });
  afterEach(() => jest.clearAllMocks());

  it("displays loading then items", async () => {
    render(<EquipmentListPage />);
    // spinner should be in document
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeDefined();

    // wait for items
    await waitFor(() => {
      expect(screen.getByText("Alpha")).not.toBeNull();
      expect(screen.getByText("Beta")).not.toBeNull();
    });
  });

  it("sorts by name descending", async () => {
    render(<EquipmentListPage />);
    await waitFor(() => screen.getByText("Alpha"));

    // change sort
    fireEvent.change(screen.getByLabelText("Sortuj:"), {
      target: { value: "nameDesc" },
    });

    // first heading should be Beta
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings[0].textContent).toContain("Beta");
  });

  it("handles API error", async () => {
    api.get.mockRejectedValueOnce(new Error());
    render(<EquipmentListPage />);
    await waitFor(() => {
      const err = screen.getByText("Błąd ładowania listy sprzętu");
      expect(err).toBeDefined();
    });
  });
});
