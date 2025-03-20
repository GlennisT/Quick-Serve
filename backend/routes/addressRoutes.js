const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress
} = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure you have authentication middleware

// Get all addresses
router.get('/addresses', authMiddleware, getAllAddresses);

// Get a specific address by ID
router.get('/addresses/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    getAddressById
);

// Create a new address
router.post('/addresses',
    authMiddleware,
    [
        body('customer_id').isInt().withMessage('Customer ID must be an integer'),
        body('first_name').notEmpty().withMessage('First name is required'),
        body('building_name').notEmpty().withMessage('Building name is required'),
        body('house_number').notEmpty().withMessage('House number is required'),
        body('street').notEmpty().withMessage('Street is required')
    ],
    createAddress
);

// Update an address by ID
router.patch('/addresses/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    updateAddress
);

// Delete an address by ID
router.delete('/addresses/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    deleteAddress
);

module.exports = router;
