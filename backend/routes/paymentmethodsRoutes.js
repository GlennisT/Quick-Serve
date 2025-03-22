const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const paymentmethodsController = require('../controllers/paymentmethodsController');
const { 
    getPaymentMethodsByRestaurant, 
    getPaymentMethodById, 
    createPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod 
} = paymentmethodsController; 


// Create a new payment method
router.post('/',
    [
        body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
        body('method').isString().notEmpty().isLength({ max: 50 }).withMessage('Payment method must be within 50 characters')
    ],
    createPaymentMethod
);
router.put('/:id', 
    param('id').isInt().withMessage('Payment method ID must be an integer'),
    body('method').notEmpty().withMessage('Method is required'),
    updatePaymentMethod
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

