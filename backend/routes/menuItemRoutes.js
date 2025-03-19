const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const menuItemController = require('../controllers/menuItemController');
const { validateMenuItemCreation, validateMenuItemUpdate } = require('../validation/menuItemValidation');
const validateRequest = require('../middleware/validationMiddleware');
const { param } = require('express-validator');

// Public Routes (No Authentication)
router.get('/:id', param('id').isInt().withMessage('Menu item ID must be an integer'), validateRequest, menuItemController.getMenuItemById);
router.get('/restaurant/:restaurantId', param('restaurantId').isInt().withMessage('Restaurant ID must be an integer'), validateRequest, menuItemController.getMenuItemsByRestaurant);

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/', validateMenuItemCreation, validateRequest, menuItemController.createMenuItem);
router.put('/:id', param('id').isInt().withMessage('Menu item ID must be an integer'), validateMenuItemUpdate, validateRequest, menuItemController.updateMenuItem);
router.delete('/:id', param('id').isInt().withMessage('Menu item ID must be an integer'), validateRequest, menuItemController.deleteMenuItem);

module.exports = router;
