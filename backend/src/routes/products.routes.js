import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
} from '../controllers/products.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { multipleImages } from '../middleware/upload.middleware.js';

const router = Router();

// Public reads
router.get('/', asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProduct));

// Protected writes
router.post('/', protect, adminOnly, asyncHandler(createProduct));
router.put('/:id', protect, adminOnly, asyncHandler(updateProduct));
router.patch('/:id', protect, adminOnly, asyncHandler(patchProduct));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

// Product images (protected)
router.post('/:id/images', protect, adminOnly, multipleImages, asyncHandler(uploadProductImages));
router.delete('/:id/images/:filename', protect, adminOnly, asyncHandler(deleteProductImage));

export default router;
