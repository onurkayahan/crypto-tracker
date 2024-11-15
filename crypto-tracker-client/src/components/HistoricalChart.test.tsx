import { render, screen } from "@testing-library/react";
import HistoricalChart from "./HistoricalChart";
import { useUnit } from "effector-react";
import { describe, expect, it, Mock, vi } from "vitest";

vi.mock("effector-react", () => ({
  useUnit: vi.fn(),
}));

describe("HistoricalChart Component", () => {
  const mockData = [
    { price: 40000, timestamp: "2024-11-01" },
    { price: 42000, timestamp: "2024-11-02" },
  ];

  it("renders the chart with data points", () => {
    (useUnit as Mock).mockReturnValue({
      selectedPair: "BTC/USDT",
      isInverse: false,
    });
    render(<HistoricalChart data={mockData} />);
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
  });
});
