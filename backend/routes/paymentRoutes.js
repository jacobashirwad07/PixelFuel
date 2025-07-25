import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentHistory,
    processRefund
} from '../controllers/paymentController.js';

const router = express.Router();

// Payment routes
router.post('/create-order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/failure', authenticate, handlePaymentFailure);
router.get('/history', authenticate, getPaymentHistory);

// Admin routes
router.post('/refund/:bookingId', authenticate, authorize('admin'), processRefund);

export default router;