import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }));
});

describe('Redis Provider', () => {
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: REDIS_CLIENT,
          useValue: new (jest.requireMock('ioredis'))(),
        },
      ],
    }).compile();

    redisClient = module.get<Redis>(REDIS_CLIENT);
  });

  it('should store and retrieve data from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    jest.spyOn(redisClient, 'set').mockResolvedValue('OK');
    jest.spyOn(redisClient, 'get').mockResolvedValue(value);

    // Store data in Redis
    await redisClient.set(key, value);
    expect(redisClient.set).toHaveBeenCalledWith(key, value);

    // Retrieve data from Redis
    const result = await redisClient.get(key);
    expect(result).toBe(value);
    expect(redisClient.get).toHaveBeenCalledWith(key);
  });

  it('should handle missing data in Redis gracefully', async () => {
    const key = 'missingKey';

    jest.spyOn(redisClient, 'get').mockResolvedValue(null);

    const result = await redisClient.get(key);
    expect(result).toBeNull();
    expect(redisClient.get).toHaveBeenCalledWith(key);
  });

  it('should delete data from Redis', async () => {
    const key = 'deleteKey';

    jest.spyOn(redisClient, 'del').mockResolvedValue(1); // Simulates successful deletion

    const result = await redisClient.del(key);
    expect(result).toBe(1);
    expect(redisClient.del).toHaveBeenCalledWith(key);
  });

  it('should handle Redis errors gracefully', async () => {
    const key = 'errorKey';

    jest.spyOn(redisClient, 'get').mockRejectedValue(new Error('Redis error'));

    await expect(redisClient.get(key)).rejects.toThrow('Redis error');
    expect(redisClient.get).toHaveBeenCalledWith(key);
  });
});
