import { productStore } from '../data/products.store.js';
import ApiError from '../utils/ApiError.js';

const validateProduct = (body, { partial = false } = {}) => {
  const errors = [];
  const { name, description, price, category, stock } = body;

  if (!partial || name !== undefined) {
    if (!name || typeof name !== 'string' || !name.trim()) errors.push('name is required');
  }
  if (!partial || price !== undefined) {
    if (price === undefined || typeof price !== 'number' || price < 0) errors.push('price must be a non-negative number');
  }
  if (!partial || category !== undefined) {
    if (!category || typeof category !== 'string') errors.push('category is required');
  }
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) errors.push('stock must be a non-negative number');

  if (errors.length) throw ApiError.badRequest(errors.join(', '));
};

export const listProducts = (req, res) => {
  let items = [...productStore.all()];

  // Query params: search, category, page, limit
  const { search, category, page = '1', limit = '10' } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (category) {
    items = items.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 10);
  const start = (pageNum - 1) * limitNum;
  const paged = items.slice(start, start + limitNum);

  res.json({
    success: true,
    total: items.length,
    page: pageNum,
    limit: limitNum,
    data: paged,
  });
};

export const getProduct = (req, res) => {
  const product = productStore.findById(Number(req.params.id));
  if (!product) throw ApiError.notFound('Product not found.');
  res.json({ success: true, data: product });
};

export const createProduct = (req, res) => {
  validateProduct(req.body);
  const product = productStore.create(req.body);
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = (req, res) => {
  const existing = productStore.findById(Number(req.params.id));
  if (!existing) throw ApiError.notFound('Product not found.');
  validateProduct(req.body); // full replace validation
  const updated = productStore.update(Number(req.params.id), req.body);
  res.json({ success: true, data: updated });
};

export const patchProduct = (req, res) => {
  const existing = productStore.findById(Number(req.params.id));
  if (!existing) throw ApiError.notFound('Product not found.');
  validateProduct(req.body, { partial: true });
  const updated = productStore.update(Number(req.params.id), req.body);
  res.json({ success: true, data: updated });
};

export const deleteProduct = (req, res) => {
  const ok = productStore.remove(Number(req.params.id));
  if (!ok) throw ApiError.notFound('Product not found.');
  res.json({ success: true, message: 'Product deleted.' });
};
