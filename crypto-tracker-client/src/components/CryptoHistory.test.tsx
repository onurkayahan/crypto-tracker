import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import CryptoHistory from "./CryptoHistory";
import { useUnit } from "effector-react";
import moment from "moment";
import { setStartDate } from "../stores/cryptoStore";

// Mock the useUnit function from effector-react to provide the required properties
vi.mock("effector-react", () => ({
  useUnit: vi.fn(),
}));

// Mock the Effector store and fetch logic
vi.mock("../stores/cryptoStore", () => ({
  $cryptoData: {
    startDate: new Date(),
  },
  setStartDate: vi.fn(),
  fetchHistoricalPrices: vi.fn(),
}));

// Mock HistoricalChart to simplify the test and focus on CryptoHistory behavior
vi.mock("./HistoricalChart", () => ({
  __esModule: true,
  default: ({ data }: { data: any[] }) => (
    <div data-testid="mock-historical-chart">{`Chart with ${data.length} data points`}</div>
  ),
}));

describe("CryptoHistory Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading message when loading", () => {
    (useUnit as Mock).mockReturnValue({
      loading: true,
      error: null,
      historicalPrices: [],
    });

    render(<CryptoHistory />);
    expect(screen.getByText("Loading historical data...")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    (useUnit as Mock).mockReturnValue({
      loading: false,
      error: "Network error",
      historicalPrices: [],
    });

    render(<CryptoHistory />);
    expect(
      screen.getByText("Error fetching historical prices: Network error")
    ).toBeInTheDocument();
  });

  it("renders the mock chart with filtered data when historicalPrices are available", () => {
    const mockData = [
      { price: 40000, timestamp: moment().subtract(1, "days").toISOString() },
      { price: 42000, timestamp: moment().subtract(5, "days").toISOString() },
      { price: 45000, timestamp: moment().subtract(10, "days").toISOString() },
    ];

    (useUnit as Mock).mockReturnValue({
      loading: false,
      error: null,
      historicalPrices: mockData,
    });

    render(<CryptoHistory />);

    // Check that the mock chart renders with the correct number of data points
    expect(screen.getByText("Price History")).toBeInTheDocument();
    expect(screen.getByTestId("mock-historical-chart")).toHaveTextContent(
      "Chart with 3 data points"
    );
  });

  it("renders an empty state message when no historicalPrices are available", () => {
    (useUnit as Mock).mockReturnValue({
      loading: false,
      error: null,
      historicalPrices: [],
    });

    render(<CryptoHistory />);
    expect(
      screen.queryByTestId("mock-historical-chart")
    ).not.toBeInTheDocument();
  });

  it("updates start date and triggers fetch on time range change", () => {
    const mockData = [
      { price: 40000, timestamp: moment().subtract(1, "days").toISOString() },
      {
        price: 42000,
        timestamp: moment().subtract(10, "days").toISOString(),
      },
      {
        price: 45000,
        timestamp: moment().subtract(95, "days").toISOString(),
      }, // Outside 90 days
    ];
    (useUnit as Mock).mockReturnValue({
      loading: false,
      error: null,
      historicalPrices: mockData,
    });

    render(<CryptoHistory />);

    (setStartDate as unknown as Mock).mockImplementationOnce((date) => {
      const thirtyDaysStartDate = moment()
        .subtract(30, "days")
        .startOf("day")
        .toDate();

      expect(moment(date).isSame(thirtyDaysStartDate, "day")).toBe(true);
    });

    // Access and open the dropdown
    const selectTrigger = screen.getByTestId("select-trigger");
    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      })
    );

    // Select the "Last 30 days" option
    const thirtyDaysOption = screen.getByText("Last 30 days");
    fireEvent.click(thirtyDaysOption);

    (setStartDate as unknown as Mock).mockImplementationOnce((date) => {
      const sevenDaysStartDate = moment()
        .subtract(7, "days")
        .startOf("day")
        .toDate();

      expect(moment(date).isSame(sevenDaysStartDate, "day")).toBe(true);
    });

    // Select the "Last 7 days" option
    fireEvent.pointerDown(
      selectTrigger,
      new MockPointerEvent("pointerdown", {
        ctrlKey: false,
        button: 0,
      })
    );

    const sevenDaysOption = screen.getByText("Last 7 days");
    fireEvent.click(sevenDaysOption);

    // Verify calls
    expect(setStartDate).toHaveBeenCalledTimes(3); // 30 days, 7 days and initial render 90 days
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
