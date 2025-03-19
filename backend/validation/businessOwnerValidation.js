const { body, param } = require('express-validator');

exports.validateBusinessOwnerRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('firstName')
        .notEmpty().withMessage('First name is required')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must contain only letters'),

    body('lastName')
        .notEmpty().withMessage('Last name is required')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Last name must contain only letters'),

    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Invalid phone number'),

    body('nationalId')
        .optional()
        .trim()
        .isInt({ min: 1 }).withMessage('National ID must be a positive integer'),
];

exports.validateBusinessOwnerUpdate = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Business owner ID must be a positive integer'),

    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),

    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('firstName')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('First name must contain only letters'),

    body('lastName')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Last name must contain only letters'),

    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Invalid phone number'),

    body('nationalId')
        .optional()
        .trim()
        .isInt({ min: 1 }).withMessage('National ID must be a positive integer'),
];
