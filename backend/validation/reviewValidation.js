const { body, param } = require('express-validator');

exports.validateReviewCreation = [
    body('customerId')
        .isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),

    body('restaurantId')
        .isInt({ min: 1 }).withMessage('Restaurant ID must be a positive integer'),

    body('rating')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),

    body('comment')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Comment must be a valid string'),
];

exports.validateReviewUpdate = [
    param('id')
        .isInt({ min: 1 }).withMessage('Review ID must be a positive integer'),

    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),

    body('comment')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Comment must be a valid string'),
];
