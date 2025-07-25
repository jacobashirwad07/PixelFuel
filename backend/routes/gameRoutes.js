import express from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, (req, res) => {
    res.json({ 
        success: true, 
        message: 'Game store routes - Coming in Week 2',
        features: [
            'Browse games by genre',
            'Search and filter games',
            'View game details and reviews',
            'Add to wishlist',
            'Purchase games'
        ]
    });
});

router.get('/featured', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Featured games - Coming in Week 2' 
    });
});

router.get('/genres', (req, res) => {
    res.json({ 
        success: true, 
        data: {
            genres: [
                'action', 'adventure', 'rpg', 'strategy', 'simulation',
                'sports', 'racing', 'puzzle', 'horror', 'mmo',
                'fps', 'moba', 'battle-royale', 'indie'
            ]
        }
    });
});

// Protected routes
router.post('/', authenticate, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Add game - Coming in Week 2' });
});

router.post('/:id/purchase', authenticate, (req, res) => {
    res.json({ success: true, message: 'Purchase game - Coming in Week 2' });
});

router.post('/:id/wishlist', authenticate, (req, res) => {
    res.json({ success: true, message: 'Add to wishlist - Coming in Week 2' });
});

export default router;