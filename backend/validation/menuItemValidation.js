const { body, param } = require('express-validator');

exports.validateMenuItemCreation = [
    body('name').notEmpty().trim().withMessage('Menu item name is required'),
    body('description').optional().trim().isString().withMessage('Description must be a string'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
];

exports.validateMenuItemUpdate = [
    param('id').isInt().withMessage('Menu item ID must be an integer'),
    body('name').optional().trim().isString().withMessage('Menu item name must be a string'),
    body('description').optional().trim().isString().withMessage('Description must be a string'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('restaurantId').optional().isInt().withMessage('Restaurant ID must be an integer'),
];
