// reviewController.js (Controller)
const Review = require('../models/review');
const Customer = require('../models/customer');
const Restaurant = require('../models/restaurant');

// Create a new review
exports.createReview = async (req, res) => {
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
};

// Get all reviews for a restaurant
exports.getReviewsByRestaurant = async (req, res) => {
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
};

// Get a specific review
exports.getReviewById = async (req, res) => {
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
};

// Update a review
exports.updateReview = async (req, res) => {
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
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        
        await review.destroy();
        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
