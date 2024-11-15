import { render, screen } from "@testing-library/react";
import CryptoPrice from "./CryptoPrice";
import { useUnit } from "effector-react";
import { describe, expect, it, Mock, vi } from "vitest";

vi.mock("effector-react", () => ({
  useUnit: vi.fn(),
}));

describe("CryptoPrice Component", () => {
  it("renders the current price in correct format", () => {
    (useUnit as Mock).mockReturnValue({
      selectedPair: "BTC/USDT",
      isInverse: false,
      currentPrice: 40000,
      loading: false,
      error: null,
    });
    render(<CryptoPrice />);
    expect(screen.getByText(/BTC\/USDT/i)).toBeInTheDocument();
    expect(screen.getByText(/40,000.000 USDT/i)).toBeInTheDocument();
  });

  it("displays loading state", () => {
    (useUnit as Mock).mockReturnValue({
      loading: true,
      error: null,
      currentPrice: null,
    });
    render(<CryptoPrice />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error message", () => {
    (useUnit as Mock).mockReturnValue({
      loading: false,
      error: "Failed to fetch price",
      currentPrice: null,
    });
    render(<CryptoPrice />);
    expect(
      screen.getByText("Error fetching price: Failed to fetch price")
    ).toBeInTheDocument();
  });
});
