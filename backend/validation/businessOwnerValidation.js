const { body, param } = require('express-validator');

exports.validateBusinessOwnerRegistration = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').notEmpty().trim().withMessage('First name is required'),
    body('lastName').notEmpty().trim().withMessage('Last name is required'),
    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Invalid phone number'),
    body('nationalId')
        .optional()
        .isNumeric()
        .withMessage('National ID must be numeric'),
];

exports.validateBusinessOwnerUpdate = [
    param('id').isInt().withMessage('Business owner ID must be an integer'),
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
        .notEmpty()
        .trim()
        .withMessage('First name is required'),
    body('lastName')
        .optional()
        .notEmpty()
        .trim()
        .withMessage('Last name is required'),
    body('phoneNumber')
        .optional()
        .isMobilePhone('any')
        .withMessage('Invalid phone number'),
    body('nationalId')
        .optional()
        .isNumeric()
        .withMessage('National ID must be numeric'),
];
