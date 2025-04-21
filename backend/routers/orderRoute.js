import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

// User routes
router.post('/create', requireSignIn, createOrder);
router.get('/user-orders', requireSignIn, getUserOrders);

// Admin routes
router.get('/all', requireSignIn, getAllOrders);
router.put('/status/:orderId', requireSignIn, updateOrderStatus);

export default router; 