const { body, param } = require('express-validator');

exports.validateAddressCreation = [
    body('streetAddress').notEmpty().trim().withMessage('Street address is required'),
    body('city').notEmpty().trim().withMessage('City is required'),
    body('state').notEmpty().trim().withMessage('State is required'),
    body('postalCode').notEmpty().trim().withMessage('Postal code is required'),
    body('country').notEmpty().trim().withMessage('Country is required'),
    body('addressType')
        .notEmpty()
        .trim()
        .isIn(['customer', 'business'])
        .withMessage('Address type must be customer or business'),
];

exports.validateAddressUpdate = [
    param('id').isInt().withMessage('Address ID must be an integer'),
    body('streetAddress').optional().trim().isString().withMessage('Street address must be a string'),
    body('city').optional().trim().isString().withMessage('City must be a string'),
    body('state').optional().trim().isString().withMessage('State must be a string'),
    body('postalCode').optional().trim().isString().withMessage('Postal code must be a string'),
    body('country').optional().trim().isString().withMessage('Country must be a string'),
    body('addressType')
        .optional()
        .trim()
        .isIn(['customer', 'business'])
        .withMessage('Address type must be customer or business'),
];
