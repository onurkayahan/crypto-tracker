export const supportedPairs = {
  'BTC/USDT': {
    coingecko: { id: 'bitcoin', vs_currency: 'usd' },
    coinmarketcap: { symbol: 'BTC', convert: 'USDT' },
  },
  'TON/USDT': {
    coingecko: { id: 'the-open-network', vs_currency: 'usd' },
    coinmarketcap: { symbol: 'TON', convert: 'USDT' },
  },
  // Add new pairs here in one place for both APIs
};
