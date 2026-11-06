import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Express apna version header me nahi bhejega (small security improvement).
app.disable('x-powered-by');

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Allow the React admin panel to call this API.
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Parse JSON and form bodies.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check: useful to confirm the server is running.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Products Admin API is running.',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Unknown API routes return JSON instead of an HTML error page.
app.use(notFound);

// Saare errors yahan se ek hi format me return honge.
app.use(errorHandler);

export default app;
