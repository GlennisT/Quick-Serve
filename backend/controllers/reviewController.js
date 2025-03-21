const Review = require('../models/review');
const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');
const { validationResult, body, param } = require('express-validator');

// Create a new review
exports.createReview = [
    body('customer_id').isInt().withMessage('Customer ID must be an integer'),
    body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('review_text').optional().isString().withMessage('Review text must be a string'),
    body('image').optional().isString().withMessage('Image must be a string (URL or file path)'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customer_id, restaurant_id, rating, review_text, image } = req.body;
            const review = await Review.create({
                customer_id,
                restaurant_id,
                rating,
                review_text,
                image
            });
            res.status(201).json({ success: true, review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

// Get all reviews for a restaurant
exports.getReviewsByRestaurant = [
    param('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { restaurant_id } = req.params;
            const reviews = await Review.findAll({
                where: { restaurant_id },
                include: [{ model: Customer, attributes: ['name'] }]
            });
            res.status(200).json({ success: true, reviews });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

// Get a specific review
exports.getReviewById = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const review = await Review.findByPk(id, {
                include: [{ model: Customer, attributes: ['name'] }, { model: Restaurant, attributes: ['name'] }]
            });
            if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
            res.status(200).json({ success: true, review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

// Update a review
exports.updateReview = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('review_text').optional().isString().withMessage('Review text must be a string'),
    body('image').optional().isString().withMessage('Image must be a string (URL or file path)'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const { rating, review_text, image } = req.body;
            const review = await Review.findByPk(id);
            if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

            await review.update({ rating, review_text, image });
            res.status(200).json({ success: true, review });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

// Delete a review
exports.deleteReview = [
    param('id').isInt().withMessage('Review ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { id } = req.params;
            const review = await Review.findByPk(id);
            if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

            await review.destroy();
            res.status(200).json({ success: true, message: 'Review deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
];