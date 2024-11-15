import { Resolver, Query, Args } from '@nestjs/graphql';
import { CryptoService } from './crypto.service';
import { PriceHistory } from './entities/price-history.entity';
import { start } from 'repl';

@Resolver()
export class CryptoResolver {
  constructor(private readonly cryptoService: CryptoService) {}

  // Query to get the latest price for a specific pair
  @Query(() => Number)
  async getCurrentPrice(
    @Args('pair') pair: string,
    @Args('source') source: string,
  ) {
    return this.cryptoService.getLatestPrice(pair, source);
  }

  // Query to get historical price data for a specific pair
  @Query(() => [PriceHistory])
  async getHistoricalPrices(
    @Args('pair') pair: string,
    @Args('source') source: string,
    @Args('startDate', { nullable: true }) startDate?: Date,
    @Args('endDate', { nullable: true }) endDate?: Date,
  ): Promise<PriceHistory[]> {
    return this.cryptoService.getHistoricalPrices(
      pair,
      source,
      startDate,
      endDate,
    );
  }
}
