import {
  connectSocket,
  disconnectSocket,
  onLiveDataUpdate,
} from "./socketService";
import { io } from "socket.io-client";
import { describe, expect, it, vi } from "vitest";

vi.mock("socket.io-client", () => ({
  io: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    connected: false,
  }),
}));

describe("SocketService", () => {
  it("connects to the socket server", () => {
    connectSocket();
    expect(io).toHaveBeenCalled();
    expect(io().connect).toHaveBeenCalled();
  });

  it("disconnects from the socket server", () => {
    io().connected = true;

    disconnectSocket();
    expect(io().disconnect).toHaveBeenCalled();
  });

  it("registers the live data update event", () => {
    const callback = vi.fn();
    onLiveDataUpdate(callback);
    expect(io().on).toHaveBeenCalledWith("updateLiveData", callback);
  });
});
