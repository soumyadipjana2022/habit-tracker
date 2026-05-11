import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect MongoDB
await connectDB();

// Security middleware
app.use(helmet());

// Allowed frontend origins
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://habit-tracker-wvvu.vercel.app'
]);

// CORS setup
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow approved origins
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      // Block others
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// Parse JSON
app.use(express.json({ limit: '1mb' }));

// Logger
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')
);

// Rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

// Health route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});