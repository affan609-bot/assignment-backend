import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import productsRouter from './routes/products.routes.js';
import uploadRouter from './routes/upload.routes.js';
import { MAX_UPLOAD_MB, UPLOAD_DIR } from './upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin panel and uploaded images. The panel is always served fresh so an old
// cached page can never keep showing a previous build.
app.use(
  express.static(publicDir, {
    setHeaders(res, filePath) {
      if (/\.(?:html|css|js)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    },
  })
);
app.use('/uploads', express.static(UPLOAD_DIR));

// Keep product data fresh in the browser too.
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// The admin panel now lives at the root URL. Keep the old link working.
app.get('/admin.html', (req, res) => res.redirect('/'));

// API routes.
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});
app.use('/api/products', productsRouter);
app.use('/api/uploads', uploadRouter);

// Unknown API route.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// Multer and application errors.
app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json({ success: false, message: `Image must be ${MAX_UPLOAD_MB} MB or smaller.` });
  }

  const status = error.status || 500;
  if (status >= 500) console.error(error);

  res.status(status).json({
    success: false,
    message: status >= 500 ? 'Something went wrong. Please try again.' : error.message,
  });
});

export default app;
