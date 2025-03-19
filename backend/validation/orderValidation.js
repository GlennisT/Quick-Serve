const { body, param } = require('express-validator');

exports.validateOrderCreation = [
    body('customerId')
        .isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),

    body('restaurantId')
        .isInt({ min: 1 }).withMessage('Restaurant ID must be a positive integer'),

    body('items')
        .isArray({ min: 1 }).withMessage('Items must be a non-empty array'),

    body('items.*.menuItemId')
        .isInt({ min: 1 }).withMessage('Menu item ID must be a positive integer'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

    body('deliveryAddressId')
        .isInt({ min: 1 }).withMessage('Delivery address ID must be a positive integer'),

    body('totalAmount')
        .isFloat({ min: 0, max: 999999.99 }).withMessage('Total amount must be a positive number and less than 1 million'),

    body('orderStatus')
        .optional()
        .isIn(['pending', 'processing', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
];

exports.validateOrderStatusUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('Order ID must be a positive integer'),

    body('orderStatus')
        .isIn(['pending', 'processing', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
];
