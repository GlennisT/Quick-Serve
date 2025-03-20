const express = require('express');
const { body, param } = require('express-validator');
const {
    createMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuItemController');

const router = express.Router();

// Create a new menu item
router.post('/',
    [
        body('business_id').isString().withMessage('Business ID must be a string'),
        body('item_name').notEmpty().withMessage('Item name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('image').optional().isString().withMessage('Image must be a valid URL or file path'),
        body('available_stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    ],
    createMenuItem
);

// Get all menu items
router.get('/', getMenuItems);

// Get a specific menu item by ID
router.get('/:id',
    param('id').isInt().withMessage('Menu item ID must be an integer'),
    getMenuItemById
);

// Update a menu item
router.patch('/:id',
    [
        param('id').isInt().withMessage('Menu item ID must be an integer'),
        body('item_name').optional().isString().withMessage('Item name must be a string'),
        body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
        body('image').optional().isString().withMessage('Image must be a valid URL or file path'),
        body('available_stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    ],
    updateMenuItem
);

// Delete a menu item
router.delete('/:id',
    param('id').isInt().withMessage('Menu item ID must be an integer'),
    deleteMenuItem
);

module.exports = router;
