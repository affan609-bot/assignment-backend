import express from 'express';
import productsRoutes from './routes/products.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

app.disable('x-powered-by');

// Simple request logger (learning purpose).
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Phase 2 Express practice server running.' });
});

// Mount products router at /api/products
app.use('/api/products', productsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
