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
const authMiddleware = require('../middleware/authMiddleware'); // Comment out if causing issues

// Get all addresses
router.get('/', authMiddleware, getAllAddresses);  // ✅ Matches `/api/addresses` in `server.js`

// Get a specific address by ID
router.get('/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    getAddressById
);

// Create a new address
router.post('/',
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
router.patch('/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    updateAddress
);

// Delete an address by ID
router.delete('/:id',
    authMiddleware,
    param('id').isInt().withMessage('ID must be an integer'),
    deleteAddress
);

module.exports = router;
