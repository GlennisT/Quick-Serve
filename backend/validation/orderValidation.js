const { body, param } = require('express-validator');

exports.validateOrderCreation = [
    body('customerId').isInt().withMessage('Customer ID must be an integer'),
    body('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.menuItemId').toInt().isInt().withMessage('Menu item ID must be an integer'),
    body('items.*.quantity').toInt().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('deliveryAddressId').isInt().withMessage('Delivery address ID must be an integer'),
    body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
    body('orderStatus')
        .optional()
        .isIn(['pending', 'processing', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
];

exports.validateOrderStatusUpdate = [
    param('id').toInt().isInt().withMessage('Order ID must be an integer'),
    body('orderStatus')
        .isIn(['pending', 'processing', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
];
