import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express();

app.disable('x-powered-by');

// Security headers.
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure MongoDB is connected (cached) before handling requests.
// Critical for serverless (Vercel) where server.js lifecycle differs.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed.',
      error: error.message,
    });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Products Admin API is running.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes (signup, login, logout, me)
app.use('/api/auth', authRoutes);

// Serve locally stored uploads (fallback when Cloudinary not configured)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Products routes (public reads, protected writes)
app.use('/api/products', productsRoutes);

// Upload routes (public list, protected upload/delete)
app.use('/api/uploads', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
