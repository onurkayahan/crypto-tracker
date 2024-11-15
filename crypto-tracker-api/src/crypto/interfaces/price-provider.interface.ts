export interface PriceProvider {
  source: string;
  getPrice(pair: string): Promise<number>;
}
