const express = require('express');
const { Cart, CartItem } = require('../models/cart');
const { MenuItem } = require('../models/menuItem');
const router = express.Router();

// Get the user's cart
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: { model: CartItem, include: MenuItem },
    });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
});

// Add an item to the cart
router.post('/add', async (req, res) => {
  const { userId, menuItemId, quantity } = req.body;

  try {
    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const cartItem = await CartItem.create({ cartId: cart.id, menuItemId, quantity });

    res.status(200).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
});

// Remove an item from the cart
router.delete('/remove/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
});

module.exports = router;
