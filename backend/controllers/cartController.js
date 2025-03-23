// controllers/cartController.js
const Cart = require('../models/cart');
const MenuItem = require('../models/menuItem');
const { validationResult } = require('express-validator');

exports.getCart = async (req, res) => {
    try {
        const userId = 1; // Temporary user ID (replace with an actual test user ID from your database)

        const cartItems = await Cart.findAll({ where: { user_id: userId } });

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { restaurant_id, menu_item_id, quantity = 1 } = req.body;
        const menuItem = await MenuItem.findByPk(menu_item_id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        const total_price = menuItem.price * quantity;
        const cartItem = await Cart.create({
            customer_id: req.user.id,
            restaurant_id,
            menu_item_id,
            quantity,
            total_price
        });
        res.status(201).json({ message: 'Item added to cart', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const cartItem = await Cart.findByPk(id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        const menuItem = await MenuItem.findByPk(cartItem.menu_item_id);
        cartItem.quantity = quantity;
        cartItem.total_price = menuItem.price * quantity;
        await cartItem.save();
        res.status(200).json({ message: 'Cart item updated successfully', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const cartItem = await Cart.findByPk(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        await cartItem.destroy();
        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing cart item', error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.destroy({ where: { customer_id: req.user.id } });
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};
