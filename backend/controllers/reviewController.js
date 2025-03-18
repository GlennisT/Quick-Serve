const Review = require('../models/review');
const { validationResult, body, param } = require('express-validator');

// Create Review
exports.createReview = [
    body('customerId').isInt(),
    body('restaurantId').isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customerId, restaurantId, rating, comment } = req.body;
            const review = await Review.create({
                customerId,
                restaurantId,
                rating,
                comment
            });
            res.status(201).json({ message: 'Review created successfully', review });
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ message: 'Error creating review', error: error.message });
        }
    }
];

// Get Review by ID
exports.getReviewById = [
    param('id').isInt(),
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
            res.status(200).json(review);
        } catch (error) {
            console.error('Error getting review:', error);
            res.status(500).json({ message: 'Error getting review', error: error.message });
        }
    }
];

// Update Review
exports.updateReview = [
    param('id').isInt(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional(),
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
            const { rating, comment } = req.body;
            review.rating = rating || review.rating;
            review.comment = comment || review.comment;
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
    param('id').isInt(),
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

// Get Reviews by Restaurant
exports.getReviewsByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const reviews = await Review.findAll({
            where: { restaurantId: restaurantId }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Error getting reviews', error: error.message });
    }
};

// Get Reviews by Customer
exports.getReviewsByCustomer = async (req, res) => {
    try {
        const customerId = req.customerId; // Get customerId from JWT
        const reviews = await Review.findAll({
            where: { customerId: customerId }
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error getting reviews by customer:', error);
        res.status(500).json({ message: 'Error getting reviews by customer', error: error.message });
    }
};