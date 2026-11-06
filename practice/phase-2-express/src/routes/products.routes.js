import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/products.controller.js';

const router = Router();

// Route params: /api/products/:id
// Query params: /api/products?search=mouse&category=Electronics&page=1&limit=5
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);   // full replace
router.patch('/:id', patchProduct);  // partial update
router.delete('/:id', deleteProduct);

export default router;
