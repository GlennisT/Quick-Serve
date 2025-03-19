const { body, param } = require('express-validator');

exports.validateAddressCreation = [
    body('streetAddress')
        .notEmpty().withMessage('Street address is required')
        .trim()
        .isString().withMessage('Street address must be a valid string'),
    
    body('city')
        .notEmpty().withMessage('City is required')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters'),

    body('state')
        .notEmpty().withMessage('State is required')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('State must contain only letters'),

    body('postalCode')
        .notEmpty().withMessage('Postal code is required')
        .trim()
        .isAlphanumeric().withMessage('Postal code must be alphanumeric'),

    body('country')
        .notEmpty().withMessage('Country is required')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Country must contain only letters'),

    body('addressType')
        .notEmpty().withMessage('Address type is required')
        .trim()
        .isIn(['customer', 'business']).withMessage('Address type must be customer or business'),
];

exports.validateAddressUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('Address ID must be a positive integer'),

    body('streetAddress')
        .optional()
        .trim()
        .isString().withMessage('Street address must be a valid string'),

    body('city')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('City must contain only letters'),

    body('state')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('State must contain only letters'),

    body('postalCode')
        .optional()
        .trim()
        .isAlphanumeric().withMessage('Postal code must be alphanumeric'),

    body('country')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Country must contain only letters'),

    body('addressType')
        .optional()
        .trim()
        .isIn(['customer', 'business']).withMessage('Address type must be customer or business'),
];
