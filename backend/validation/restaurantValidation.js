const { body, param } = require('express-validator');

exports.validateRestaurantCreation = [
    body('name')
        .notEmpty().trim().withMessage('Restaurant name is required')
        .isLength({ min: 2 }).withMessage('Restaurant name must be at least 2 characters long'),

    body('description')
        .optional().trim().isLength({ min: 1 }).withMessage('Description must be a valid string'),

    body('cuisine')
        .optional().trim().isLength({ min: 2 }).withMessage('Cuisine must be at least 2 characters long'),

    body('imageUrl')
        .optional().isURL().withMessage('Image URL must be a valid URL'),

    body('businessOwnerId')
        .isInt({ min: 1 }).withMessage('Business owner ID must be a positive integer'),
];

exports.validateRestaurantUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('Restaurant ID must be a positive integer'),

    body('name')
        .optional().trim().isLength({ min: 2 }).withMessage('Restaurant name must be at least 2 characters long'),

    body('description')
        .optional().trim().isLength({ min: 1 }).withMessage('Description must be a valid string'),

    body('cuisine')
        .optional().trim().isLength({ min: 2 }).withMessage('Cuisine must be at least 2 characters long'),

    body('imageUrl')
        .optional().isURL().withMessage('Image URL must be a valid URL'),

    body('businessOwnerId')
        .optional().isInt({ min: 1 }).withMessage('Business owner ID must be a positive integer'),
];
