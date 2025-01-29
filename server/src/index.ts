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
const port = process.env.PORT || 3002;
connectDB();

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
      ? ['https://payments-projects.vercel.app', 'https://payments-projects-ecksjyrys-shaked4041s-projects.vercel.app']
        : 'http://localhost:5174',
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

// app.use('/bills', billRouter);
app.use('/bills', authenticateTokenMiddlware, billRouter);
// app.use('/payments', paymentRouter);
app.use('/payments', authenticateTokenMiddlware, paymentRouter);
app.use('/webhooks', webhookRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
