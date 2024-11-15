import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    console.log("Connecting to socket server");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("Disconnecting to socket server");
    socket.disconnect();
  }
};

export const onLiveDataUpdate = (callback: (data: any) => void) => {
  socket.on("updateLiveData", callback);
};

export const offLiveDataUpdate = () => {
  socket.off("updateLiveData");
};
