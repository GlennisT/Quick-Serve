const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');
const { validateReviewCreation, validateReviewUpdate } = require('../validation/reviewValidation');
const validateRequest = require('../middleware/validationMiddleware');

// 📌 Public Routes (No Authentication)
router.get('/restaurant/:restaurantId', reviewController.getReviewsByRestaurant); // Get reviews for a restaurant
router.get('/:id', reviewController.getReviewById); // Get a specific review by ID

// 🔒 Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.get('/customer', reviewController.getReviewsByCustomer); // Get reviews written by the authenticated user
router.post('/', validateReviewCreation, validateRequest, reviewController.createReview); // Create a new review
router.put('/:id', validateReviewUpdate, validateRequest, reviewController.updateReview); // Update a review
router.delete('/:id', reviewController.deleteReview); // Delete a review

module.exports = router;
