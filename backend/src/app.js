import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

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
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// Basic error handler. It will be extended in the backend-structure step.
app.use((error, req, res, next) => {
  const status = error.statusCode || error.status || 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message: status >= 500 ? 'Internal server error.' : error.message,
  });
});

export default app;
