import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db';
import cors from 'cors';
import billRouter from './routes/billRoutes';
import paymentRouter from './routes/paymentRoutes';
import webhookRouter from './webhooks/webhookListener';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import http from 'http';
import cookieParser from 'cookie-parser';
import { authenticateTokenMiddlware } from './middleware/auth';
import { initializeSocket } from './services/socketService';

dotenv.config();

const app = express();
const port = process.env.PORT;
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Origin',
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  })
);

app.options('*', cors());

const server = http.createServer(app);
initializeSocket(server);

app.use('/bills', authenticateTokenMiddlware, billRouter);
app.use('/payments', authenticateTokenMiddlware, paymentRouter);
app.use('/webhooks', webhookRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ['http://localhost:5174', 'http://localhost:5173'],
//     methods: ['GET', 'POST'],
//   },
// });
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

//  export const sendPaymentUpdate = (billId: string, status: string) => {
//    io.emit('paymentStatusUpdate', { billId, status });
//  };

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
