const Restaurant = require('../models/restaurant');
const Address = require('../models/address');
const { validationResult } = require('express-validator');

// Centralized error handler
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ message, error: error.message });
};

// Create Restaurant
exports.createRestaurant = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const restaurant = await Restaurant.create({ ...req.body, ownerId: req.businessOwnerId });
        res.status(201).json({ message: 'Restaurant created successfully', restaurant });
    } catch (error) {
        handleError(res, error, 'Error creating restaurant');
    }
};

// Get Restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByPk(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        res.status(200).json(restaurant);
    } catch (error) {
        handleError(res, error, 'Error fetching restaurant');
    }
};

// Update Restaurant (Ensure Ownership)
exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ where: { id: req.params.id, ownerId: req.businessOwnerId } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found or unauthorized' });

        await restaurant.update(req.body);
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        handleError(res, error, 'Error updating restaurant');
    }
};

// Delete Restaurant (Ensure Ownership)
exports.deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ where: { id: req.params.id, ownerId: req.businessOwnerId } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found or unauthorized' });

        await restaurant.destroy();
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting restaurant');
    }
};

// Get Restaurants by Owner
exports.getRestaurantsByOwner = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({ where: { ownerId: req.businessOwnerId } });
        res.status(200).json(restaurants);
    } catch (error) {
        handleError(res, error, 'Error fetching restaurants by owner');
    }
};

// Add Restaurant Address
exports.addRestaurantAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const restaurant = await Restaurant.findOne({ where: { id: req.params.restaurantId, ownerId: req.businessOwnerId } });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found or unauthorized' });

        const address = await Address.create({
            ...req.body,
            addressType: 'restaurant',
            addressableId: req.params.restaurantId,
            addressableType: 'Restaurant'
        });

        res.status(201).json({ message: 'Restaurant address added successfully', address });
    } catch (error) {
        handleError(res, error, 'Error adding restaurant address');
    }
};

// Update Restaurant Address
exports.updateRestaurantAddress = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const address = await Address.findByPk(req.params.addressId);
        if (!address || address.addressableId !== req.params.restaurantId || address.addressableType !== 'Restaurant') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        const restaurant = await Restaurant.findOne({ where: { id: req.params.restaurantId, ownerId: req.businessOwnerId } });
        if (!restaurant) return res.status(403).json({ message: 'Unauthorized to update this address' });

        await address.update(req.body);
        res.status(200).json({ message: 'Restaurant address updated successfully', address });
    } catch (error) {
        handleError(res, error, 'Error updating restaurant address');
    }
};

// Delete Restaurant Address
exports.deleteRestaurantAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.addressId);
        if (!address || address.addressableId !== req.params.restaurantId || address.addressableType !== 'Restaurant') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        const restaurant = await Restaurant.findOne({ where: { id: req.params.restaurantId, ownerId: req.businessOwnerId } });
        if (!restaurant) return res.status(403).json({ message: 'Unauthorized to delete this address' });

        await address.destroy();
        res.status(200).json({ message: 'Restaurant address deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting restaurant address');
    }
};
