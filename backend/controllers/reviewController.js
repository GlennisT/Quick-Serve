const Review = require('../models/review');
const { validationResult, body, param } = require('express-validator');

// Get All Reviews
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get Reviews by Restaurant ID
exports.getReviewsByRestaurant = [
    param('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const reviews = await Review.findAll({ where: { restaurant_id: req.params.restaurant_id } });
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Error fetching reviews', error: error.message });
        }
    }
];

// Get Reviews by Customer ID
exports.getReviewsByCustomer = [
    param('customer_id').isInt().withMessage('Customer ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const reviews = await Review.findAll({ where: { customer_id: req.params.customer_id } });
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Error fetching reviews', error: error.message });
        }
    }
];

// Create Review
exports.createReview = [
    body('customer_id').isInt().withMessage('Customer ID is required and must be an integer'),
    body('restaurant_id').isInt().withMessage('Restaurant ID is required and must be an integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review_text').optional().isString().withMessage('Review text must be a string'),
    body('image').optional().isString().withMessage('Image URL must be a string'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customer_id, restaurant_id, rating, review_text, image = null } = req.body;

            const review = await Review.create({
                customer_id,
                restaurant_id,
                rating,
                review_text,
                image
            });

            res.status(201).json({ message: 'Review created successfully', review });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ message: 'Error creating review', error: error.message });
        }
    }
];

// Update Review
exports.updateReview = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review_text').optional().isString().withMessage('Review text must be a string'),
    body('image').optional().isString().withMessage('Image URL must be a string'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const review = await Review.findByPk(req.params.id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            Object.assign(review, req.body);
            await review.save();

            res.status(200).json({ message: 'Review updated successfully', review });
        } catch (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ message: 'Error updating review', error: error.message });
        }
    }
];

// Delete Review
exports.deleteReview = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const review = await Review.findByPk(req.params.id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            await review.destroy();
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ message: 'Error deleting review', error: error.message });
        }
    }
];
