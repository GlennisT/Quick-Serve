const { body, param } = require('express-validator');

exports.validateReviewCreation = [
    body('customerId').isInt().withMessage('Customer ID must be an integer'),
    body('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .isString().withMessage('Comment must be a string')
        .trim()
];

exports.validateReviewUpdate = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
    body('comment')
        .optional()
        .isString().withMessage('Comment must be a string')
        .trim()
];
