import { render, screen, fireEvent } from "@testing-library/react";
import SelectPairButton from "./SelectPairButton";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useUnit } from "effector-react";

// Mock `useUnit` directly
vi.mock("effector-react", () => ({
  useUnit: vi.fn(),
}));

// Mock the crypto store functions
vi.mock("../stores/cryptoStore", () => ({
  $cryptoData: vi.fn(),
  setSelectedPair: vi.fn(),
  setIsInverse: vi.fn(),
}));

// Import the mocked functions for verification
import { setSelectedPair, setIsInverse } from "../stores/cryptoStore";

describe("SelectPairButton Component", () => {
  const mockPair = "BTC/USD";

  beforeEach(() => {
    // Mock `useUnit` to return specific values for each test
    (useUnit as Mock).mockReturnValue({
      selectedPair: mockPair,
      isInverse: false,
    });
  });

  it("renders with correct pair name", () => {
    render(<SelectPairButton pair={mockPair} />);
    expect(screen.getByText(/BTC\/USD/i)).toBeInTheDocument();
  });

  it("calls setSelectedPair when clicked", () => {
    render(<SelectPairButton pair={mockPair} />);
    fireEvent.click(screen.getByRole("button"));
    expect(setSelectedPair).toHaveBeenCalledWith(mockPair);
  });

  it("toggles isInverse when swap icon is clicked", () => {
    render(<SelectPairButton pair={mockPair} />);

    // Verify that the swap icon renders
    const swapIcon = screen.getByTestId("swap-icon");
    expect(swapIcon).toBeInTheDocument();

    // Click the swap icon and verify setIsInverse is called
    fireEvent.click(swapIcon);
    expect(setIsInverse).toHaveBeenCalled();
  });
});
