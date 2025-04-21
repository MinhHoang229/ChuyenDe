import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Cart routes
router.post('/add', requireSignIn, addToCart);
router.put('/update', requireSignIn, updateCart);
router.get('/', requireSignIn, getUserCart);

export default router;
