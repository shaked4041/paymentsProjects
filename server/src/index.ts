import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from 'cors';
import billRouter from './routes/billRoutes';
import paymentRouter from './routes/paymentRoutes';
import webhookRouter from './webhooks/webhookListener';
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes'
import { Server } from 'socket.io';
import http from 'http';
import { authenticateTokenMiddlware } from './middleware/auth';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = 3002;
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
      'Access-Control-Allow-Origin'
    ],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
  })
);

app.options('*', cors());


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

// app.use('/bills', billRouter);
app.use('/bills',authenticateTokenMiddlware, billRouter);
app.use('/payments',authenticateTokenMiddlware, paymentRouter);
// app.use('/payments', paymentRouter);
app.use('/webhooks', webhookRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter)

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

export const sendPaymentUpdate = (billId: string, status: string) => {
  io.emit('paymentStatusUpdate', { billId, status });
};

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
