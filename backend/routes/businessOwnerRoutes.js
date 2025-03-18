const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const businessOwnerController = require('../controllers/businessOwnerController');
const { validateBusinessOwnerRegistration } = require('../validation/businessOwnerValidation');
const validateRequest = require('../middleware/validationMiddleware');

// Public Routes (No Authentication)
router.post('/register', validateBusinessOwnerRegistration, validateRequest, businessOwnerController.createBusinessOwner);
router.post('/login', businessOwnerController.loginBusinessOwner);

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.get('/profile', businessOwnerController.getBusinessOwnerById);
router.put('/profile', businessOwnerController.updateBusinessOwnerProfile);
router.delete('/profile', businessOwnerController.deleteBusinessOwner);
router.get('/restaurants', businessOwnerController.getRestaurantsByBusinessOwner);

// Address related routes
router.post('/addresses', businessOwnerController.addBusinessOwnerAddress);
router.get('/addresses', businessOwnerController.getBusinessOwnerAddresses);
router.put('/addresses/:addressId', businessOwnerController.updateBusinessOwnerAddress);
router.delete('/addresses/:addressId', businessOwnerController.deleteBusinessOwnerAddress);

module.exports = router;