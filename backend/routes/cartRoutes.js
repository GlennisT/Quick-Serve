const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Get the cart for the authenticated customer
router.get('/cart', authMiddleware, getCart);

// Add an item to the cart
router.post('/cart',
    authMiddleware,
    [
        body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
        body('menu_item_id').isInt().withMessage('Menu Item ID must be an integer'),
        body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    addToCart
);

// Update cart item quantity
router.patch('/cart/:id',
    authMiddleware,
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    updateCartItem
);

// Remove a specific item from the cart
router.delete('/cart/:id',
    authMiddleware,
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    removeCartItem
);

// Clear the entire cart for the authenticated customer
router.delete('/cart', authMiddleware, clearCart);

module.exports = router;
