import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    createBooking,
    getUserBookings,
    getProviderBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    rateBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// User booking routes
router.post('/', authenticate, createBooking);
router.get('/user', authenticate, getUserBookings);
router.get('/provider', authenticate, authorize('coach', 'service-provider'), getProviderBookings);
router.get('/:id', authenticate, getBookingById);

// Booking management routes
router.put('/:id/status', authenticate, updateBookingStatus);
router.put('/:id/cancel', authenticate, cancelBooking);
router.post('/:id/rate', authenticate, rateBooking);

export default router;