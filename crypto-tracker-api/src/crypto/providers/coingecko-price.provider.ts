import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PriceProvider } from '../interfaces/price-provider.interface';
import { supportedPairs } from '../supported-pairs';
import { REDIS_CLIENT } from '../../redis/redis.provider';
import Redis from 'ioredis';

@Injectable()
export class CoinGeckoPriceProvider implements PriceProvider {
  source = 'CoinGecko';
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private apiToken: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {
    this.apiToken = this.configService.get<string>('COINGECKO_API_TOKEN');
  }

  async getPrice(pair: string): Promise<number> {
    const mapping = supportedPairs[pair]?.coingecko;
    if (!mapping) {
      throw new Error(`Pair ${pair} not supported by CoinGecko`);
    }

    const { id, vs_currency } = mapping;
    const url = `${this.baseUrl}/simple/price`;
    const params = { ids: id, vs_currencies: vs_currency };
    const headers = {
      accept: 'application/json',
      'x-cg-pro-api-key': this.apiToken,
    };

    try {
      const response = await axios.get(url, { headers, params });

      const priceInUSD = response.data[id][vs_currency];

      // Convert to USDT if necessary
      if (vs_currency === 'usd') {
        const usdtExchangeRate = await this.getUSDtoUSDTExchangeRate(
          url,
          headers,
        );

        return priceInUSD / usdtExchangeRate;
      }
      return priceInUSD;
    } catch (error) {
      console.error(`Error fetching price from CoinGecko: ${error.message}`);
      throw error;
    }
  }

  private async getUSDtoUSDTExchangeRate(
    url: string,
    headers: any,
  ): Promise<number> {
    try {
      const cachedPrice = await this.redisClient.get('usdtToUsdExchangeRate');
      if (cachedPrice) return parseFloat(cachedPrice);

      const params = { ids: 'tether', vs_currencies: 'usd' };
      const response = await axios.get(url, { headers, params });
      const usdtToUsdExchangeRate = response.data.tether.usd;

      await this.redisClient.set(
        'usdtToUsdExchangeRate',
        usdtToUsdExchangeRate.toString(),
        'EX',
        30, // 30 seconds expiration after all pairs use the same value in every cron job run
      );

      return usdtToUsdExchangeRate;
    } catch (error) {
      console.error('Error fetching USD to USDT exchange rate:', error.message);
      throw error;
    }
  }
}
