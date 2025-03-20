const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a new review
router.post("/create", reviewController.createReview);

// Get all reviews for a specific restaurant
router.get("/restaurant/:restaurant_id", reviewController.getReviewsByRestaurant);

// Get a single review by ID
router.get("/:id", reviewController.getReviewById);

// Update a review by ID
router.put("/:id", reviewController.updateReview);

// Delete a review by ID
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
