// routes/cartRoutes.js
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

router.get('/', authMiddleware, getCart);

router.post('/',
    authMiddleware,
    [
        body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
        body('menu_item_id').isInt().withMessage('Menu Item ID must be an integer'),
        body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    ],
    addToCart
);

router.patch('/:id',
    authMiddleware,
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    updateCartItem
);

router.delete('/:id',
    authMiddleware,
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    removeCartItem
);

router.delete('/', authMiddleware, clearCart);

module.exports = router;

