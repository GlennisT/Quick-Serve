const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const restaurantController = require('../controllers/restaurantController');
const { validateRestaurantCreation } = require('../validation/restaurantValidation');
const validateRequest = require('../middleware/validationMiddleware');

// ✅ Public Routes (No Authentication)
router.get('/', restaurantController.getAllRestaurants); // Get all restaurants (public)
router.get('/:id', restaurantController.getRestaurantById); // Get a restaurant by ID (public)

// ✅ Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/', validateRestaurantCreation, validateRequest, restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.get('/owner/:ownerId', restaurantController.getRestaurantsByOwner); // Fix: Add :ownerId for clarity

// ✅ Address-related routes
router.post('/:restaurantId/addresses', restaurantController.addRestaurantAddress);
router.get('/:restaurantId/addresses', restaurantController.getRestaurantAddresses);
router.put('/:restaurantId/addresses/:addressId', restaurantController.updateRestaurantAddress);
router.delete('/:restaurantId/addresses/:addressId', restaurantController.deleteRestaurantAddress);

module.exports = router;
