import { useMemo } from 'react';
import { io } from 'socket.io-client';
const ioAddress = String(process.env.REACT_APP_IO_URL_DEV);

export const useSocket = () => {
  const socket = useMemo(() => {
    return io(ioAddress, { transports: ['websocket'] });
  }, []);

  return { socket };
};
