import { gql } from "@apollo/client";
import { createStore, createEffect, createEvent, sample } from "effector";
import client from "../apolloClient";

export const GET_PRICE_AND_HISTORY = gql`
  query GetPriceAndHistory(
    $pair: String!
    $source: String!
    $startDate: DateTime
    $endDate: DateTime
  ) {
    currentPrice: getCurrentPrice(pair: $pair, source: $source)
    historicalPrices: getHistoricalPrices(
      pair: $pair
      source: $source
      startDate: $startDate
      endDate: $endDate
    ) {
      price
      source
      timestamp
      pair
    }
  }
`;

interface PriceHistory {
  pair: string;
  price: number;
  source: string;
  timestamp: string;
}

export interface CryptoData {
  supportedPairs: string[];
  selectedPair: string | null;
  isInverse: boolean;
  currentPrice: number | null;
  historicalPrices: PriceHistory[];
  loading: boolean;
  error: string | null;
  startDate: Date | null;
  selectedSource: string | null;
  supportedSources: string[];
}

// Initialize the store with default values
export const $cryptoData = createStore<CryptoData>({
  supportedPairs: ["TON/USDT", "BTC/USDT"], // Replace with supported pairs from api later
  selectedPair: null,
  isInverse: false,
  currentPrice: null,
  historicalPrices: [],
  loading: false,
  error: null,
  startDate: null,
  selectedSource: "CoinGecko", // Default selectedSource, can be typed as enum
  supportedSources: ["CoinGecko", "CoinMarketCap"], // Replace with supported sources from api later
});

export const setSelectedPair = createEvent<string>();
export const setIsInverse = createEvent<boolean>();
export const setStartDate = createEvent<Date>();
export const setSelectedSource = createEvent<string>();
export const liveDataUpdate = createEvent<PriceHistory>();

// Define an effect to fetch combined data for the selected pair, source, and startDate
export const fetchCryptoDataFx = createEffect(
  async ({
    pair,
    source,
    startDate,
  }: {
    pair: string;
    source: string;
    startDate?: Date;
  }) => {
    if (!pair || !source) return; // Skip execution if `pair` or `source` is falsy

    try {
      const { data } = await client.query({
        query: GET_PRICE_AND_HISTORY,
        variables: {
          pair,
          source,
          ...(startDate && { startDate }), // Include startDate only if defined
        },
      });
      return { ...data };
    } catch (error: any) {
      throw new Error(error.message || "Error fetching crypto data");
    }
  }
);

$cryptoData
  .on(setSelectedPair, (state, pair) => ({
    ...state,
    selectedPair: pair,
    isInverse: false,
    currentPrice: null,
    historicalPrices: [],
    loading: true,
    error: null,
  }))
  .on(setIsInverse, (state, isInverse) => ({
    ...state,
    isInverse,
  }))
  .on(setStartDate, (state, startDate) => ({
    ...state,
    startDate,
  }))
  .on(setSelectedSource, (state, source) => ({
    ...state,
    selectedSource: source,
  }))
  .on(fetchCryptoDataFx.doneData, (state, data) => ({
    ...state,
    currentPrice: data.currentPrice,
    historicalPrices: data.historicalPrices,
    loading: false,
    error: null,
  }))
  .on(fetchCryptoDataFx.failData, (state, error) => ({
    ...state,
    loading: false,
    error: error.message,
  }))
  .on(liveDataUpdate, (state, newCurrentPrice) => ({
    ...state,
    currentPrice:
      state.selectedSource === newCurrentPrice.source &&
      state.selectedPair === newCurrentPrice.pair
        ? newCurrentPrice.price
        : state.currentPrice,
    historicalPrices:
      state.selectedSource === newCurrentPrice.source &&
      state.selectedPair === newCurrentPrice.pair
        ? state.historicalPrices.concat(newCurrentPrice)
        : state.historicalPrices,
  }));

// Helper function to format data for fetchCryptoDataFx
const formatCryptoData = (state: CryptoData) => ({
  pair: state.selectedPair as string,
  source: state.selectedSource as string,
  startDate: state.startDate || undefined,
});

// Sample for each change event to trigger `fetchCryptoDataFx` independently
sample({
  clock: setSelectedPair,
  source: $cryptoData,
  filter: (state) => Boolean(state.selectedPair && state.selectedSource),
  fn: formatCryptoData,
  target: fetchCryptoDataFx,
});

sample({
  clock: setSelectedSource,
  source: $cryptoData,
  filter: (state) => Boolean(state.selectedPair && state.selectedSource),
  fn: formatCryptoData,
  target: fetchCryptoDataFx,
});

sample({
  clock: setStartDate,
  source: $cryptoData,
  filter: (state) => Boolean(state.selectedPair && state.selectedSource),
  fn: formatCryptoData,
  target: fetchCryptoDataFx,
});
