import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { Repository } from 'typeorm';
import { PriceHistory } from './entities/price-history.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { CoinGeckoPriceProvider } from './providers/coingecko-price.provider';
import { CoinMarketCapPriceProvider } from './providers/coinmarketcap-price.provider';
import { CryptoGateway } from './crypto.gateway';
import { REDIS_CLIENT } from '../redis/redis.provider';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
  }));
});

describe('CryptoService', () => {
  let service: CryptoService;
  let redisClient: Redis;
  let priceHistoryRepository: Repository<PriceHistory>;

  const mockPriceHistoryRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const MockCoinGeckoProvider = {
    getPrice: jest.fn(),
  };

  const MockCoinMarketCapProvider = {
    getPrice: jest.fn(),
  };

  const MockCryptoGateway = {
    broadcastLiveData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: getRepositoryToken(PriceHistory),
          useValue: mockPriceHistoryRepository,
        },
        {
          provide: CoinGeckoPriceProvider,
          useValue: MockCoinGeckoProvider,
        },
        {
          provide: CoinMarketCapPriceProvider,
          useValue: MockCoinMarketCapProvider,
        },
        {
          provide: CryptoGateway,
          useValue: MockCryptoGateway,
        },
        {
          provide: REDIS_CLIENT,
          useValue: new (jest.requireMock('ioredis'))(),
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    redisClient = module.get<Redis>(REDIS_CLIENT);
    priceHistoryRepository = module.get<Repository<PriceHistory>>(
      getRepositoryToken(PriceHistory),
    );
  });

  it('should fetch latest price from cache', async () => {
    jest.spyOn(redisClient, 'get').mockResolvedValue('45000');
    const price = await service.getLatestPrice('BTC/USDT', 'CoinGecko');
    expect(price).toBe(45000);
    expect(redisClient.get).toHaveBeenCalledWith('BTC/USDT_CoinGecko');
  });
});
