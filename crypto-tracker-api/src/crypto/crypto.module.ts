import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto.service';
import { CryptoResolver } from './crypto.resolver';
import { PriceHistory } from './entities/price-history.entity';
import { CoinGeckoPriceProvider } from './providers/coingecko-price.provider';
import { CoinMarketCapPriceProvider } from './providers/coinmarketcap-price.provider';
import { RedisModule } from '../redis/redis.module';
import { CryptoGateway } from './crypto.gateway';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PriceHistory]),
    RedisModule,
  ],
  providers: [
    CryptoService,
    CryptoGateway,
    CryptoResolver,
    CoinGeckoPriceProvider,
    CoinMarketCapPriceProvider,
  ],
  exports: [CryptoService],
})
export class CryptoModule {}
