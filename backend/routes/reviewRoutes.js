const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');
const { validateReviewCreation, validateReviewUpdate } = require('../validation/reviewValidation'); // Assuming you have these validations
const validateRequest = require('../middleware/validationMiddleware');

// Public Routes (No Authentication)
router.get('/restaurant/:restaurantId', reviewController.getReviewsByRestaurant); // Get reviews by restaurant (public)
router.get('/:id', reviewController.getReviewById); // get a review by id.

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/', validateReviewCreation, validateRequest, reviewController.createReview);
router.put('/:id', validateReviewUpdate, validateRequest, reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.get('/customer', reviewController.getReviewsByCustomer);

module.exports = router;