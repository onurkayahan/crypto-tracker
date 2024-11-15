import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PriceProvider } from '../interfaces/price-provider.interface';
import { supportedPairs } from '../supported-pairs';

@Injectable()
export class CoinMarketCapPriceProvider implements PriceProvider {
  source = 'CoinMarketCap';
  private baseUrl = 'https://pro-api.coinmarketcap.com/v1';
  private apiToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get<string>('COINMARKETCAP_API_TOKEN');
  }

  async getPrice(pair: string): Promise<number> {
    const mapping = supportedPairs[pair]?.coinmarketcap;
    if (!mapping) {
      throw new Error(`Pair ${pair} not supported by CoinMarketCap`);
    }
    const { symbol, convert } = mapping;
    const url = `${this.baseUrl}/cryptocurrency/quotes/latest`;
    const headers = { 'X-CMC_PRO_API_KEY': this.apiToken };
    const params = { symbol, convert };

    try {
      const response = await axios.get(url, { headers, params });

      const price = response.data.data[symbol].quote[convert].price;

      return price;
    } catch (error) {
      console.error(
        `Error fetching price from CoinMarketCap: ${error.message}`,
      );
      throw error;
    }
  }
}
