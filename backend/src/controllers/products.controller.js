import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const validateProduct = (body, { partial = false } = {}) => {
  const errors = [];
  const { name, description, price, category, stock } = body;

  if (!partial || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      errors.push('name is required and must be at least 3 characters');
    }
  }
  if (!partial || price !== undefined) {
    if (price === undefined || typeof price !== 'number' || price < 0) {
      errors.push('price must be a non-negative number');
    }
  }
  if (!partial || category !== undefined) {
    if (!category || typeof category !== 'string') {
      errors.push('category is required');
    }
  }
  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    errors.push('stock must be a non-negative number');
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  if (errors.length) throw ApiError.badRequest(errors.join(', '));
};

// GET /api/products  (public)
export const getProducts = async (req, res) => {
  const { search, category, page = '1', limit = '10' } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (category) {
    filter.category = { $regex: `^${category}$`, $options: 'i' };
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    data: items,
  });
};

// GET /api/products/:id  (public)
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');
  res.json({ success: true, data: product });
};

// POST /api/products  (protected)
export const createProduct = async (req, res) => {
  validateProduct(req.body);
  const product = await Product.create({
    ...req.body,
    createdBy: req.admin?._id,
  });
  res.status(201).json({ success: true, data: product });
};

// PUT /api/products/:id  (protected, full replace)
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');
  validateProduct(req.body);
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: updated });
};

// PATCH /api/products/:id  (protected, partial)
export const patchProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');
  validateProduct(req.body, { partial: true });
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: updated });
};

// DELETE /api/products/:id  (protected)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw ApiError.notFound('Product not found.');
  // Image file deletion will be added in upload phase.
  res.json({ success: true, message: 'Product deleted.', data: product });
};
