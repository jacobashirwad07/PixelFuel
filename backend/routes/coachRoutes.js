import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Gaming coach routes - Coming in Week 2',
        features: [
            'Browse gaming coaches',
            'Filter by game and rank',
            'View coach profiles',
            'Book coaching sessions',
            'Rate and review coaches'
        ]
    });
});

router.get('/games', (req, res) => {
    res.json({ 
        success: true, 
        data: {
            supportedGames: [
                'Valorant', 'League of Legends', 'CS:GO', 'Dota 2',
                'Overwatch 2', 'Apex Legends', 'Fortnite', 'Rocket League',
                'Call of Duty', 'Rainbow Six Siege'
            ]
        }
    });
});

// Protected routes
router.get('/profile', authenticate, authorize('coach'), (req, res) => {
    res.json({ success: true, message: 'Coach profile - Coming in Week 2' });
});

router.post('/apply', authenticate, (req, res) => {
    res.json({ success: true, message: 'Apply to become coach - Coming in Week 2' });
});

router.post('/:id/book', authenticate, (req, res) => {
    res.json({ success: true, message: 'Book coaching session - Coming in Week 2' });
});

export default router;