import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { isAdmin, isAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/create', isAuth, createOrder);
router.get('/user-orders', isAuth, getUserOrders);

// Admin routes
router.get('/all', isAuth, isAdmin, getAllOrders);
router.put('/status/:orderId', isAuth, isAdmin, updateOrderStatus);
router.delete('/:orderId', isAuth, isAdmin, deleteOrder);

export default router; 