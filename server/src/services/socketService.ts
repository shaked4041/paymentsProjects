import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
      ? 'https://payments-projects.vercel.app' 
      : ['http://localhost:5174', 'http://localhost:5173'], 
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

export const sendPaymentUpdate = (billId: string, status: string) => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  io.emit('paymentStatusUpdate', { billId, status });
};
