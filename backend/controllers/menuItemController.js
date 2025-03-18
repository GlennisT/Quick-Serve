const MenuItem = require('../models/menuItem');
const { validationResult, body, param } = require('express-validator');

// Create Menu Item
exports.createMenuItem = [
    body('name').notEmpty(),
    body('price').isDecimal(),
    body('restaurantId').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, description, price, imageUrl, category, available, restaurantId } = req.body;
            const menuItem = await MenuItem.create({
                name,
                description,
                price,
                imageUrl,
                category,
                available,
                restaurantId
            });
            res.status(201).json({ message: 'Menu item created successfully', menuItem });
        } catch (error) {
            console.error('Error creating menu item:', error);
            res.status(500).json({ message: 'Error creating menu item', error: error.message });
        }
    }
];

// Get Menu Item by ID
exports.getMenuItemById = [
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const menuItem = await MenuItem.findByPk(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            res.status(200).json(menuItem);
        } catch (error) {
            console.error('Error getting menu item:', error);
            res.status(500).json({ message: 'Error getting menu item', error: error.message });
        }
    }
];

// Update Menu Item
exports.updateMenuItem = [
    param('id').isInt(),
    body('name').optional(),
    body('price').optional().isDecimal(),
    body('restaurantId').optional().isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const menuItem = await MenuItem.findByPk(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            const { name, description, price, imageUrl, category, available, restaurantId } = req.body;
            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price || menuItem.price;
            menuItem.imageUrl = imageUrl || menuItem.imageUrl;
            menuItem.category = category || menuItem.category;
            menuItem.available = available !== undefined ? available : menuItem.available;
            menuItem.restaurantId = restaurantId || menuItem.restaurantId;
            await menuItem.save();
            res.status(200).json({ message: 'Menu item updated successfully', menuItem });
        } catch (error) {
            console.error('Error updating menu item:', error);
            res.status(500).json({ message: 'Error updating menu item', error: error.message });
        }
    }
];

// Delete Menu Item
exports.deleteMenuItem = [
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const menuItem = await MenuItem.findByPk(req.params.id);
            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            await menuItem.destroy();
            res.status(200).json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            console.error('Error deleting menu item:', error);
            res.status(500).json({ message: 'Error deleting menu item', error: error.message });
        }
    }
];

// Get Menu Items by Restaurant ID
exports.getMenuItemsByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menuItems = await MenuItem.findAll({
            where: { restaurantId: restaurantId }
        });
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error getting menu items:', error);
        res.status(500).json({ message: 'Error getting menu items', error: error.message });
    }
};