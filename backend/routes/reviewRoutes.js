const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { createReview, getReviewsByRestaurant, getReviewById, updateReview, deleteReview } = reviewController;

// Create a new review
router.post("/create", createReview);

// Get all reviews for a specific restaurant
router.get("/restaurant/:restaurant_id", getReviewsByRestaurant);

// Get a single review by ID
router.get("/:id", getReviewById);

// Update a review by ID
router.put("/:id", updateReview);

// Delete a review by ID
router.delete("/:id", deleteReview);

module.exports = router;