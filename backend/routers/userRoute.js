import express from 'express';
import { addToCart, updateCart, getUserCart } from '../controllers/cartController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { register, login, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Cart routes
router.post('/add', requireSignIn, addToCart);
router.put('/update', requireSignIn, updateCart);
router.get('/get-cart', requireSignIn, getUserCart);

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.put('/profile', requireSignIn, updateProfile);

export default router;