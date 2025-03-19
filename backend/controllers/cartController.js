const Cart = require('../models/cart');
const MenuItem = require('../models/menuItem');
const { validationResult, body, param } = require('express-validator');

// Get All Cart Items for a Customer
exports.getCartItems = [
    param('customer_id').isInt().withMessage('Customer ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const cartItems = await Cart.findAll({ where: { customer_id: req.params.customer_id } });
            res.status(200).json(cartItems);
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).json({ message: 'Error fetching cart items', error: error.message });
        }
    }
];

// Add Item to Cart
exports.addToCart = [
    body('customer_id').isInt().withMessage('Customer ID must be an integer'),
    body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    body('menu_item_id').isInt().withMessage('Menu Item ID must be an integer'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customer_id, restaurant_id, menu_item_id, quantity = 1 } = req.body;

            // Get Menu Item Price
            const menuItem = await MenuItem.findByPk(menu_item_id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            const total_price = menuItem.price * quantity;

            // Check if the item already exists in the cart
            let cartItem = await Cart.findOne({
                where: { customer_id, restaurant_id, menu_item_id }
            });

            if (cartItem) {
                // Update quantity and total price
                cartItem.quantity += quantity;
                cartItem.total_price += total_price;
                await cartItem.save();
            } else {
                // Create new cart item
                cartItem = await Cart.create({
                    customer_id,
                    restaurant_id,
                    menu_item_id,
                    quantity,
                    total_price
                });
            }

            res.status(201).json({ message: 'Item added to cart', cartItem });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Error adding to cart', error: error.message });
        }
    }
];

// Update Cart Item Quantity
exports.updateCartItem = [
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            // Get Menu Item Price
            const menuItem = await MenuItem.findByPk(cartItem.menu_item_id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            // Update total price
            cartItem.quantity = req.body.quantity;
            cartItem.total_price = menuItem.price * cartItem.quantity;
            await cartItem.save();

            res.status(200).json({ message: 'Cart item updated successfully', cartItem });
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ message: 'Error updating cart item', error: error.message });
        }
    }
];

// Remove Item from Cart
exports.removeCartItem = [
    param('id').isInt().withMessage('Cart item ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const cartItem = await Cart.findByPk(req.params.id);
            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            await cartItem.destroy();
            res.status(200).json({ message: 'Cart item removed successfully' });
        } catch (error) {
            console.error('Error removing cart item:', error);
            res.status(500).json({ message: 'Error removing cart item', error: error.message });
        }
    }
];

// Clear Cart for a Customer
exports.clearCart = [
    param('customer_id').isInt().withMessage('Customer ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            await Cart.destroy({ where: { customer_id: req.params.customer_id } });
            res.status(200).json({ message: 'Cart cleared successfully' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ message: 'Error clearing cart', error: error.message });
        }
    }
];
