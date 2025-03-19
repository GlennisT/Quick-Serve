const { body, param } = require('express-validator');

exports.validateMenuItemCreation = [
    body('name')
        .notEmpty().withMessage('Menu item name is required')
        .trim()
        .matches(/^[A-Za-z0-9\s-]+$/).withMessage('Menu item name must contain only letters, numbers, spaces, or hyphens'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be a string with a maximum of 500 characters'),

    body('price')
        .isFloat({ min: 0, max: 999999.99 }).withMessage('Price must be a positive number and less than 1 million'),

    body('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be a valid URL'),

    body('restaurantId')
        .isInt({ min: 1 }).withMessage('Restaurant ID must be a positive integer'),
];

exports.validateMenuItemUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('Menu item ID must be a positive integer'),

    body('name')
        .optional()
        .trim()
        .matches(/^[A-Za-z0-9\s-]+$/).withMessage('Menu item name must contain only letters, numbers, spaces, or hyphens'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must be a string with a maximum of 500 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0, max: 999999.99 }).withMessage('Price must be a positive number and less than 1 million'),

    body('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be a valid URL'),

    body('restaurantId')
        .optional()
        .isInt({ min: 1 }).withMessage('Restaurant ID must be a positive integer'),
];
