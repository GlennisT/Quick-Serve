const express = require('express');
const { body, param } = require('express-validator');
const {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    deleteCustomer
} = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Customer Registration
router.post('/register',
    [
        body('first_name').notEmpty().withMessage('First name is required'),
        body('last_name').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    registerCustomer
);

// Customer Login
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    loginCustomer
);

// Get Customer Profile (Authenticated)
router.get('/profile', authMiddleware, getCustomerProfile);

// Update Customer Profile
router.patch('/profile',
    authMiddleware,
    [
        body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
        body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('street').optional().notEmpty().withMessage('Street cannot be empty'),
        body('building').optional().notEmpty().withMessage('Building cannot be empty'),
        body('house_number').optional().notEmpty().withMessage('House number cannot be empty')
    ],
    updateCustomerProfile
);

// Delete Customer Account
router.delete('/profile', authMiddleware, deleteCustomer);

module.exports = router;
