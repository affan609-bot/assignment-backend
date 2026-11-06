import { Router } from 'express';
import {
  createProduct,
  deleteImageFile,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../store.js';

const router = Router();

function validateProduct(body = {}) {
  const errors = {};

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
  const price =
    body.price === '' || body.price === null || body.price === undefined
      ? NaN
      : Number(body.price);
  const stock =
    body.stock === '' || body.stock === null || body.stock === undefined
      ? NaN
      : Number(body.stock);

  if (name.length < 2) errors.name = 'Product name must be at least 2 characters.';
  if (name.length > 120) errors.name = 'Product name must be 120 characters or fewer.';
  if (!Number.isFinite(price) || price < 0) errors.price = 'Price must be 0 or more.';
  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = 'Stock must be a whole number of 0 or more.';
  }
  if (description.length > 1000) {
    errors.description = 'Description must be 1000 characters or fewer.';
  }
  if (imageUrl && !/^\/uploads\/[a-zA-Z0-9._-]+$/.test(imageUrl)) {
    errors.imageUrl = 'Use an image uploaded through /api/uploads.';
  }

  return {
    errors,
    value: {
      name,
      description,
      price: Math.round(price * 100) / 100,
      stock,
      imageUrl,
    },
  };
}

function notFound(res) {
  return res.status(404).json({ success: false, message: 'Product not found.' });
}

// GET /api/products?search=lamp
router.get('/', (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : '';
  const products = listProducts(search);

  res.json({ success: true, count: products.length, data: products });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = getProduct(Number(req.params.id));
  if (!product) return notFound(res);
  res.json({ success: true, data: product });
});

// POST /api/products
router.post('/', (req, res) => {
  const { value, errors } = validateProduct(req.body);

  if (Object.keys(errors).length) {
    return res.status(422).json({
      success: false,
      message: 'Please check the product details.',
      errors,
    });
  }

  res.status(201).json({ success: true, data: createProduct(value) });
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = Number.isInteger(id) ? getProduct(id) : null;
  if (!existing) return notFound(res);

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const nextImageUrl = Object.hasOwn(body, 'imageUrl') ? body.imageUrl : existing.imageUrl;
  const { value, errors } = validateProduct({ ...body, imageUrl: nextImageUrl });

  if (Object.keys(errors).length) {
    return res.status(422).json({
      success: false,
      message: 'Please check the product details.',
      errors,
    });
  }

  if (existing.imageUrl && existing.imageUrl !== value.imageUrl) {
    deleteImageFile(existing.imageUrl);
  }

  res.json({ success: true, data: updateProduct(id, value) });
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = Number.isInteger(id) ? getProduct(id) : null;
  if (!existing) return notFound(res);

  deleteProduct(id);
  deleteImageFile(existing.imageUrl);

  res.json({ success: true, data: { id, deleted: true } });
});

export default router;
