import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  uploadSingle,
  uploadMultiple,
  listUploads,
  deleteUpload,
} from '../controllers/upload.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { singleImage, multipleImages } from '../middleware/upload.middleware.js';

const router = Router();

// Public: view uploaded files list
router.get('/', asyncHandler(listUploads));

// Protected: upload + delete
router.post('/single', protect, adminOnly, singleImage, asyncHandler(uploadSingle));
router.post('/multiple', protect, adminOnly, multipleImages, asyncHandler(uploadMultiple));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteUpload));

export default router;
