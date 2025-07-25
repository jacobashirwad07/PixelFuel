import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
    res.json({ 
        success: true, 
        message: 'Gaming admin dashboard - Coming in Week 2',
        features: [
            'Manage games and services',
            'Verify coaches and providers',
            'Monitor bookings and payments',
            'User management',
            'Analytics and reports'
        ]
    });
});

router.get('/users', authenticate, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'User management - Coming in Week 2' });
});

router.get('/coaches', authenticate, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Coach management - Coming in Week 2' });
});

router.get('/services', authenticate, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Service management - Coming in Week 2' });
});

export default router;