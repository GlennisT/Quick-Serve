const { body, param } = require('express-validator');

exports.validateRestaurantCreation = [
    body('name').notEmpty().trim().withMessage('Restaurant name is required'),
    body('description').optional().trim().isString().withMessage('Description must be a string'),
    body('cuisine').optional().trim().isString().withMessage('Cuisine must be a string'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('businessOwnerId').isInt().withMessage('Business owner ID must be an integer'),
];

exports.validateRestaurantUpdate = [
    param('id').isInt().withMessage('Restaurant ID must be an integer'),
    body('name').optional().trim().isString().withMessage('Restaurant name must be a string'),
    body('description').optional().trim().isString().withMessage('Description must be a string'),
    body('cuisine').optional().trim().isString().withMessage('Cuisine must be a string'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('businessOwnerId').optional().isInt().withMessage('Business owner ID must be an integer'),
];
