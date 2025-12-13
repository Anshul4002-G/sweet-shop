import express from 'express';
import {
  createSweet,
  getAllSweets,
  getSweetById,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from '../controllers/sweetController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAllSweets);
router.get('/search', searchSweets);
router.get('/:id', getSweetById);

// Protected routes - require authentication
router.post('/:id/purchase', authenticate, purchaseSweet);

// Admin only routes
router.post('/', authenticate, isAdmin, createSweet);
router.put('/:id', authenticate, isAdmin, updateSweet);
router.delete('/:id', authenticate, isAdmin, deleteSweet);
router.post('/:id/restock', authenticate, isAdmin, restockSweet);

export default router;