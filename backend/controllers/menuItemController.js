const MenuItem = require('../models/menuItem');
const { validationResult, body, param } = require('express-validator');

// Centralized error handler
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ message, error: error.message });
};

// Create Menu Item
exports.createMenuItem = [
    body('name').notEmpty().withMessage('Menu item name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const menuItem = await MenuItem.create(req.body);
            res.status(201).json({ message: 'Menu item created successfully', menuItem });
        } catch (error) {
            handleError(res, error, 'Error creating menu item');
        }
    }
];

// Get Menu Item by ID
exports.getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
        res.status(200).json(menuItem);
    } catch (error) {
        handleError(res, error, 'Error fetching menu item');
    }
};

// Get Menu Items by Restaurant ID
exports.getMenuItemsByRestaurant = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({ where: { restaurantId: req.params.restaurantId } });
        res.status(200).json(menuItems);
    } catch (error) {
        handleError(res, error, 'Error fetching menu items');
    }
};

// Update Menu Item
exports.updateMenuItem = [
    param('id').isInt().withMessage('Menu item ID must be an integer'),
    body('name').optional().notEmpty().withMessage('Menu item name cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const menuItem = await MenuItem.findByPk(req.params.id);
            if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

            await menuItem.update(req.body);
            res.status(200).json({ message: 'Menu item updated successfully', menuItem });
        } catch (error) {
            handleError(res, error, 'Error updating menu item');
        }
    }
];

// Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByPk(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

        await menuItem.destroy();
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting menu item');
    }
};
