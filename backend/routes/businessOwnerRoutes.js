const express = require('express');
const { body } = require('express-validator');
const {
    createBusinessOwner,
    loginBusinessOwner,
    getBusinessOwnerById,
    updateBusinessOwnerProfile,
    deleteBusinessOwner,
    getRestaurantsByBusinessOwner
} = require('../controllers/businessOwnerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new business owner
router.post('/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    createBusinessOwner
);

// Business owner login
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    loginBusinessOwner
);

// Get business owner profile (protected)
router.get('/profile', authMiddleware, getBusinessOwnerById);

// Update business owner profile (protected)
router.put('/profile',
    authMiddleware,
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    updateBusinessOwnerProfile
);

// Delete business owner profile (protected)
router.delete('/profile', authMiddleware, deleteBusinessOwner);

// Get all restaurants owned by the business owner (protected)
router.get('/restaurants', authMiddleware, getRestaurantsByBusinessOwner);

module.exports = router;