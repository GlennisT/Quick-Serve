const express = require('express');
const { MenuItem } = require('../models/menuItem');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
});

// Add a new menu item
router.post('/', async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    const newMenuItem = await MenuItem.create({ name, description, price, image });
    res.status(201).json({ message: 'Menu item added', item: newMenuItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
});

module.exports = router;
