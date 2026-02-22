import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import uploadRoutes from './routes/upload';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
const prisma = new PrismaClient();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
