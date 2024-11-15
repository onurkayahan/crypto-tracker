import { render, fireEvent, screen } from "@testing-library/react";
import SelectSourceComboBox from "./SelectSourceComboBox";
import { describe, expect, it, Mock, vi } from "vitest";
import { useUnit } from "effector-react";
import { setSelectedSource } from "../stores/cryptoStore";

vi.mock("effector-react", () => ({
  useUnit: vi.fn(),
}));

vi.mock("../stores/cryptoStore", () => ({
  $cryptoData: {
    selectedSource: null,
    supportedSources: ["CoinGecko", "CoinMarketCap"],
  },
  setSelectedSource: vi.fn(),
}));

describe("SelectSourceComboBox Component", () => {
  it("renders the dropdown with available sources", async () => {
    (useUnit as Mock).mockReturnValue({
      selectedSource: "",
      supportedSources: ["CoinGecko", "CoinMarketCap"],
    });

    render(<SelectSourceComboBox />);

    const trigger = screen.getByTestId("select-trigger");
    fireEvent.pointerDown(
      trigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      })
    );

    screen.debug();
    expect(screen.getByText("CoinGecko")).toBeInTheDocument();
    expect(screen.getByText("CoinMarketCap")).toBeInTheDocument();
  });

  it("calls setSelectedSource when a source is selected", () => {
    (useUnit as Mock).mockReturnValue({
      selectedSource: "CoinGecko",
      supportedSources: ["CoinGecko", "CoinMarketCap"],
    });

    render(<SelectSourceComboBox />);

    const trigger = screen.getByTestId("select-trigger");
    fireEvent.pointerDown(
      trigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      })
    );
    screen.debug();
    const coinMarketCapOption = screen.getByText(/CoinMarketCap/i);
    fireEvent.click(coinMarketCapOption);

    expect(setSelectedSource).toHaveBeenCalledWith("CoinMarketCap");
  });
});

/**
 * JSDOM doesn't implement PointerEvent so we need to mock our own implementation
 * Default to mouse left click interaction
 * https://github.com/radix-ui/primitives/issues/1822
 * https://github.com/jsdom/jsdom/pull/2666
 */
class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerType = props.pointerType || "mouse";
  }
}

window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
