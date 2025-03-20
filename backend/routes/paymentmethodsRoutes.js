const express = require('express');
const { body, param } = require('express-validator');
const {
    createPaymentMethod,
    getPaymentMethodsByRestaurant,
    getPaymentMethodById,
    deletePaymentMethod
} = require('../controllers/paymentmethodsController');

const router = express.Router();

// Create a new payment method
router.post('/',
    [
        body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
        body('method').isString().notEmpty().isLength({ max: 50 }).withMessage('Payment method must be within 50 characters')
    ],
    createPaymentMethod
);

// Get all payment methods by restaurant ID
router.get('/restaurant/:restaurant_id',
    param('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    getPaymentMethodsByRestaurant
);

// Get a single payment method by ID
router.get('/:id',
    param('id').isInt().withMessage('Payment Method ID must be an integer'),
    getPaymentMethodById
);

// Delete a payment method by ID
router.delete('/:id',
    param('id').isInt().withMessage('Payment Method ID must be an integer'),
    deletePaymentMethod
);

module.exports = router;

