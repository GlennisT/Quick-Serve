const Restaurant = require('../models/restaurant');
const { validationResult, body, param } = require('express-validator');

// Get All Restaurants
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

// Get Restaurant by ID
exports.getRestaurantById = [
    param('id').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const restaurant = await Restaurant.findByPk(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            res.status(200).json(restaurant);
        } catch (error) {
            console.error('Error fetching restaurant:', error);
            res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
        }
    }
];

// Create a new Restaurant
exports.createRestaurant = [
    body('business_owner_id').isInt().withMessage('Business owner ID is required and must be an integer'),
    body('name').isString().notEmpty().withMessage('Restaurant name is required'),
    body('location').isString().notEmpty().withMessage('Location is required'),
    body('logo').optional().isString().withMessage('Logo must be a string (URL or file path)'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { business_owner_id, name, location, logo, openingHours, closingHours } = req.body;

            const restaurant = await Restaurant.create({
                business_owner_id,
                name,
                location,
                logo,
                openingHours,
                closingHours
            });

            res.status(201).json({ message: 'Restaurant created successfully', restaurant });
        } catch (error) {
            console.error('Error creating restaurant:', error);
            res.status(500).json({ message: 'Error creating restaurant', error: error.message });
        }
    }
];

// Update Restaurant
exports.updateRestaurant = [
    param('id').isInt().withMessage('Restaurant ID must be an integer'),
    body('name').optional().isString().notEmpty().withMessage('Restaurant name must be a valid string'),
    body('location').optional().isString().notEmpty().withMessage('Location must be a valid string'),
    body('logo').optional().isString().withMessage('Logo must be a string (URL or file path)'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const restaurant = await Restaurant.findByPk(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            Object.assign(restaurant, req.body);
            await restaurant.save();

            res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
        } catch (error) {
            console.error('Error updating restaurant:', error);
            res.status(500).json({ message: 'Error updating restaurant', error: error.message });
        }
    }
];

// Delete Restaurant
exports.deleteRestaurant = [
    param('id').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const restaurant = await Restaurant.findByPk(req.params.id);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }
            await restaurant.destroy();
            res.status(200).json({ message: 'Restaurant deleted successfully' });
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
        }
    }
];
