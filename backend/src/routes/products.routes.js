import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

// Public reads
router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProduct));

// Protected writes
router.post('/', protect, adminOnly, asyncHandler(createProduct));
router.put('/:id', protect, adminOnly, asyncHandler(updateProduct));
router.patch('/:id', protect, adminOnly, asyncHandler(patchProduct));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

export default router;
