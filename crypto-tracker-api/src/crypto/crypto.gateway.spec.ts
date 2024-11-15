import { Test, TestingModule } from '@nestjs/testing';
import { CryptoGateway } from './crypto.gateway';
import { Server, Socket } from 'socket.io';

describe('CryptoGateway', () => {
  let gateway: CryptoGateway;
  let mockServer: Partial<Server>;

  beforeEach(async () => {
    mockServer = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoGateway],
    })
      .overrideProvider('WebSocketServer')
      .useValue(mockServer)
      .compile();

    gateway = module.get<CryptoGateway>(CryptoGateway);
    gateway.server = mockServer as Server;

    jest.clearAllMocks(); // Clears all mock call data
  });

  it('should initialize WebSocket server', () => {
    const server = {} as Server;
    gateway.afterInit(server);
    expect(gateway.server).toBeDefined();
  });

  it('should handle client connection', () => {
    const client = { id: 'client1' } as unknown as Socket;
    jest.spyOn(console, 'log').mockImplementation();

    gateway.handleConnection(client);
    expect(console.log).toHaveBeenCalledWith(`Client connected: ${client.id}`);
  });

  it('should handle client disconnection', () => {
    const client = { id: 'client1' } as unknown as Socket;
    jest.spyOn(console, 'log').mockImplementation();

    gateway.handleDisconnect(client);
    expect(console.log).toHaveBeenCalledWith(
      `Client disconnected: ${client.id}`,
    );
  });

  it('should broadcast live data to clients', () => {
    const mockData = { pair: 'BTC/USDT', price: 45000 };
    gateway.broadcastLiveData(mockData);

    expect(mockServer.emit).toHaveBeenCalledWith('updateLiveData', mockData);
  });
});
