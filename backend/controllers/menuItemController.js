const MenuItem = require('../models/menuItem');
const { validationResult, body, param } = require('express-validator');

// Get All Menu Items
exports.getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll();
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
};

// Get Menu Item by ID
exports.getMenuItemById = [
    param('id').isInt().withMessage('ID must be an integer'),
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
            console.error('Error fetching menu item:', error);
            res.status(500).json({ message: 'Error fetching menu item', error: error.message });
        }
    }
];

// Create Menu Item
exports.createMenuItem = [
    body('business_id').notEmpty().withMessage('Business ID is required'),
    body('item_name').notEmpty().withMessage('Item name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('image').optional(),
    body('available_stock').optional().isInt({ min: 0 }).withMessage('Available stock must be a non-negative integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { business_id, item_name, price, image, available_stock } = req.body;
            const menuItem = await MenuItem.create({
                business_id,
                item_name,
                price,
                image: image || null,
                available_stock: available_stock !== undefined ? available_stock : 10
            });
            res.status(201).json({ message: 'Menu item created successfully', menuItem });
        } catch (error) {
            console.error('Error creating menu item:', error);
            res.status(500).json({ message: 'Error creating menu item', error: error.message });
        }
    }
];

// Update Menu Item
exports.updateMenuItem = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('business_id').optional(),
    body('item_name').optional(),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('image').optional(),
    body('available_stock').optional().isInt({ min: 0 }).withMessage('Available stock must be a non-negative integer'),
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
            Object.assign(menuItem, req.body);
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
    param('id').isInt().withMessage('ID must be an integer'),
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
