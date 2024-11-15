import { Test, TestingModule } from '@nestjs/testing';
import { CryptoResolver } from './crypto.resolver';
import { CryptoService } from './crypto.service';
import { PriceHistory } from './entities/price-history.entity';

describe('CryptoResolver', () => {
  let resolver: CryptoResolver;
  let mockCryptoService: Partial<CryptoService>;

  beforeEach(async () => {
    mockCryptoService = {
      getLatestPrice: jest.fn(),
      getHistoricalPrices: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoResolver,
        { provide: CryptoService, useValue: mockCryptoService },
      ],
    }).compile();

    resolver = module.get<CryptoResolver>(CryptoResolver);
  });

  it('should fetch the latest price', async () => {
    const mockPrice = 45000;
    jest
      .spyOn(mockCryptoService, 'getLatestPrice')
      .mockResolvedValue(mockPrice);

    const result = await resolver.getCurrentPrice('BTC/USDT', 'CoinGecko');
    expect(result).toBe(mockPrice);
    expect(mockCryptoService.getLatestPrice).toHaveBeenCalledWith(
      'BTC/USDT',
      'CoinGecko',
    );
  });

  it('should throw an error if getLatestPrice fails', async () => {
    jest
      .spyOn(mockCryptoService, 'getLatestPrice')
      .mockRejectedValue(new Error('Service Error'));

    await expect(
      resolver.getCurrentPrice('BTC/USDT', 'CoinGecko'),
    ).rejects.toThrow('Service Error');
    expect(mockCryptoService.getLatestPrice).toHaveBeenCalledWith(
      'BTC/USDT',
      'CoinGecko',
    );
  });

  it('should fetch historical prices', async () => {
    const mockHistory: PriceHistory[] = [
      {
        id: 1,
        pair: 'BTC/USDT',
        price: 45000,
        timestamp: new Date(),
        source: 'CoinGecko',
      },
    ];
    jest
      .spyOn(mockCryptoService, 'getHistoricalPrices')
      .mockResolvedValue(mockHistory);

    const result = await resolver.getHistoricalPrices('BTC/USDT', 'CoinGecko');
    expect(result).toEqual(mockHistory);
    expect(mockCryptoService.getHistoricalPrices).toHaveBeenCalledWith(
      'BTC/USDT',
      'CoinGecko',
      undefined,
      undefined,
    );
  });

  it('should handle errors when fetching historical prices', async () => {
    jest
      .spyOn(mockCryptoService, 'getHistoricalPrices')
      .mockRejectedValue(new Error('Database Error'));

    await expect(
      resolver.getHistoricalPrices('BTC/USDT', 'CoinGecko'),
    ).rejects.toThrow('Database Error');
    expect(mockCryptoService.getHistoricalPrices).toHaveBeenCalledWith(
      'BTC/USDT',
      'CoinGecko',
      undefined,
      undefined,
    );
  });
});
