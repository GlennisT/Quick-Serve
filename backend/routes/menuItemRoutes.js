const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const menuItemController = require('../controllers/menuItemController');
const { validateMenuItemCreation } = require('../validation/menuItemValidation');
const validateRequest = require('../middleware/validationMiddleware');

// Public Routes (No Authentication)
router.get('/:id', menuItemController.getMenuItemById);
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/', validateMenuItemCreation, validateRequest, menuItemController.createMenuItem);
router.put('/:id', menuItemController.updateMenuItem);
router.delete('/:id', menuItemController.deleteMenuItem);

module.exports = router;