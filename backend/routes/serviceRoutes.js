import express from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import {
    getServices,
    getServiceById,
    getServiceCategories,
    createService,
    updateService,
    deleteService
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getServices);
router.get('/categories', getServiceCategories);
router.get('/:id', getServiceById);

// Protected routes
router.post('/', authenticate, authorize('admin'), createService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

export default router;