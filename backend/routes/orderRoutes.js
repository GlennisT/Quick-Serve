// orderRoutes.js
const express = require('express');
const { body, param } = require('express-validator');
const {
    createOrder,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Create a new order
router.post('/',
    [
        body('customer_id').isInt().withMessage('Customer ID must be an integer'),
        body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
        body('total_price').isFloat({ min: 0.01 }).withMessage('Total price must be a positive number'),
        body('payment_method').isIn(['Cash', 'M-Pesa']).withMessage('Invalid payment method')
    ],
    createOrder
);

// Get order by ID
router.get('/:order_id',
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    getOrderById
);

// Get all orders for a specific customer
router.get('/customer/:customer_id',
    param('customer_id').isInt().withMessage('Customer ID must be an integer'),
    getOrdersByCustomer
);

// Update order status
router.patch('/:order_id/status',
    [
        param('order_id').isInt().withMessage('Order ID must be an integer'),
        body('order_status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid order status')
    ],
    updateOrderStatus
);

// Update payment status
router.patch('/:order_id/payment-status',
    [
        param('order_id').isInt().withMessage('Order ID must be an integer'),
        body('payment_status').isIn(['Pending', 'Paid', 'Failed']).withMessage('Invalid payment status'),
        body('transaction_id').optional().isString().withMessage('Transaction ID must be a string')
    ],
    updatePaymentStatus
);

// Delete an order
router.delete('/:order_id',
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    deleteOrder
);

module.exports = router;

