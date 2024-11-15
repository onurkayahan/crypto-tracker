import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { PriceHistory } from './entities/price-history.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import Redis from 'ioredis';
import { CoinGeckoPriceProvider } from './providers/coingecko-price.provider';
import { CoinMarketCapPriceProvider } from './providers/coinmarketcap-price.provider';
import { PriceProvider } from './interfaces/price-provider.interface';
import { REDIS_CLIENT } from '../redis/redis.provider';
import { CryptoGateway } from './crypto.gateway';

@Injectable()
export class CryptoService {
  private providers: PriceProvider[];

  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: Repository<PriceHistory>,
    private readonly coinGeckoProvider: CoinGeckoPriceProvider,
    private readonly coinMarketCapProvider: CoinMarketCapPriceProvider,
    private readonly cryptoGateway: CryptoGateway,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {
    this.providers = [this.coinGeckoProvider, this.coinMarketCapProvider];
  }

  async getLatestPrice(pair: string, source: string): Promise<number> {
    const cachedPrice = await this.redisClient.get(`${pair}_${source}`);
    if (cachedPrice) return parseFloat(cachedPrice);

    for (const provider of this.providers) {
      try {
        const price = await provider.getPrice(pair);
        // extend the expiration time 30 minutes with new price if fallback or first time
        await this.redisClient.set(
          `${pair}_${provider.source}`,
          price.toString(),
          'EX',
          1800,
        );
        return price;
      } catch (error) {
        console.error(
          `Error fetching price from ${provider.source} for ${pair}: ${error.message}`,
        );
      }
    }
    throw new Error(`Failed to fetch price for ${pair} from all providers`);
  }

  async getHistoricalPrices(
    pair: string,
    source: string,
    startDate?: Date,
    endDate: Date = new Date(), // Default end date to current date
  ): Promise<PriceHistory[]> {
    const cacheKey = `historical_${pair}_${source}_${startDate?.toISOString() ?? 'null'}_${endDate.toISOString()}`;

    // Check Redis for cached data
    const cachedData = await this.redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const whereCondition: any = { pair, source };
    if (startDate && endDate) {
      whereCondition.timestamp = Between(startDate, endDate);
    } else if (startDate) {
      whereCondition.timestamp = MoreThanOrEqual(startDate);
    } else if (endDate) {
      whereCondition.timestamp = LessThanOrEqual(endDate);
    }

    const historicalData = await this.priceHistoryRepository.find({
      where: whereCondition,
      order: { timestamp: 'DESC' },
      take: 50,
    });

    // Cache the result for 1 minutes since
    await this.redisClient.set(
      cacheKey,
      JSON.stringify(historicalData),
      'EX',
      60,
    );

    return historicalData;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updatePriceHistory() {
    const pairs = ['TON/USDT', 'BTC/USDT'];
    for (const pair of pairs) {
      for (const provider of this.providers) {
        try {
          const price = await provider.getPrice(pair);

          // extend the expiration time 30 minutes with new price
          await this.redisClient.set(
            `${pair}_${provider.source}`,
            price.toString(),
            'EX',
            1800,
          );
          const newCurrentPrice = await this.priceHistoryRepository.save({
            pair,
            price,
            source: provider.source,
          });

          this.cryptoGateway.broadcastLiveData(newCurrentPrice);
        } catch (error) {
          console.error(
            `Error updating price history from ${provider.source} for ${pair}: ${error.message}`,
          );
        }
      }
    }
  }
}
