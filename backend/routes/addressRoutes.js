const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const {
    getAddress,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressesByAddressable
} = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all addresses
router.get('/addresses', authMiddleware, getAddress);

// Route to get a specific address by ID with validation
router.get('/addresses/:id',
    authMiddleware,
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    getAddressById
);

// Route to create a new address with validation
router.post('/addresses',
    authMiddleware,
    [
        body('street_address').notEmpty().withMessage('Street address is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('country').notEmpty().withMessage('Country is required'),
        body('zipcode').optional().isPostalCode('any').withMessage('Invalid postal code')
    ],
    createAddress
);

// Route to update an address by ID using PATCH for partial updates
router.patch('/addresses/:id',
    authMiddleware,
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    updateAddress
);

// Route to delete an address by ID with validation
router.delete('/addresses/:id',
    authMiddleware,
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    deleteAddress
);

// Route to get addresses by addressable ID and type
router.get('/addresses/search',
    authMiddleware,
    [
        query('addressableId').isUUID().withMessage('Addressable ID must be a valid UUID'),
        query('addressableType').notEmpty().withMessage('Addressable type is required')
    ],
    getAddressesByAddressable
);

module.exports = router;
