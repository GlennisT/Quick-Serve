const Review = require('../models/review');
const { validationResult, body, param } = require('express-validator');

// Centralized error response function
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ message, error: error.message });
};

// ✅ Create a Review
exports.createReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const review = await Review.create({
            customerId: req.user.id, // Ensure only the logged-in user can create
            restaurantId: req.body.restaurantId,
            rating: req.body.rating,
            comment: req.body.comment,
        });

        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        handleError(res, error, 'Error creating review');
    }
};

// ✅ Get Review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        res.status(200).json(review);
    } catch (error) {
        handleError(res, error, 'Error fetching review');
    }
};

// ✅ Get Reviews for a Restaurant
exports.getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { restaurantId: req.params.restaurantId } });
        res.status(200).json(reviews);
    } catch (error) {
        handleError(res, error, 'Error fetching restaurant reviews');
    }
};

// ✅ Get Reviews by Logged-in Customer
exports.getReviewsByCustomer = async (req, res) => {
    try {
        const reviews = await Review.findAll({ where: { customerId: req.user.id } });
        res.status(200).json(reviews);
    } catch (error) {
        handleError(res, error, 'Error fetching customer reviews');
    }
};

// ✅ Update Review (Only the Owner can update)
exports.updateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // 🔒 Ensure only the owner can update
        if (review.customerId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own review' });
        }

        await review.update(req.body);
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        handleError(res, error, 'Error updating review');
    }
};

// ✅ Delete Review (Only the Owner can delete)
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // 🔒 Ensure only the owner can delete
        if (review.customerId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: You can only delete your own review' });
        }

        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting review');
    }
};
