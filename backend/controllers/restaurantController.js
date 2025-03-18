const Restaurant = require('../models/restaurant');
const { validationResult, body, param } = require('express-validator');
const Address = require('../models/address');

// Create Restaurant
exports.createRestaurant = [
    body('name').notEmpty(),
    body('ownerId').isInt(),
    body('cuisine').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, ownerId, cuisine, description, imageUrl, contactNumber, openingHours } = req.body;
            const restaurant = await Restaurant.create({
                name,
                ownerId,
                cuisine,
                description,
                imageUrl,
                contactNumber,
                openingHours
            });
            res.status(201).json({ message: 'Restaurant created successfully', restaurant });
        } catch (error) {
            console.error('Error creating restaurant:', error);
            res.status(500).json({ message: 'Error creating restaurant', error: error.message });
        }
    }
];

// Get Restaurant by ID
exports.getRestaurantById = [
    param('id').isInt(),
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
            console.error('Error getting restaurant:', error);
            res.status(500).json({ message: 'Error getting restaurant', error: error.message });
        }
    }
];

// Update Restaurant
exports.updateRestaurant = [
    param('id').isInt(),
    body('name').optional(),
    body('cuisine').optional(),
    body('ownerId').optional().isInt(),
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
            const { name, ownerId, cuisine, description, imageUrl, contactNumber, openingHours } = req.body;
            restaurant.name = name || restaurant.name;
            restaurant.ownerId = ownerId || restaurant.ownerId;
            restaurant.cuisine = cuisine || restaurant.cuisine;
            restaurant.description = description || restaurant.description;
            restaurant.imageUrl = imageUrl || restaurant.imageUrl;
            restaurant.contactNumber = contactNumber || restaurant.contactNumber;
            restaurant.openingHours = openingHours || restaurant.openingHours;
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
    param('id').isInt(),
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

// Get Restaurants by Owner
exports.getRestaurantsByOwner = async (req, res) => {
    try {
        const ownerId = req.businessOwnerId; // Get ownerId from JWT
        const restaurants = await Restaurant.findAll({
            where: { ownerId: ownerId }
        });
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error getting restaurants by owner:', error);
        res.status(500).json({ message: 'Error getting restaurants by owner', error: error.message });
    }
};

// Add Restaurant Address
exports.addRestaurantAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.create({
            street,
            city,
            county,
            subCounty,
            postalCode,
            latitude,
            longitude,
            addressType: 'restaurant',
            addressableId: req.params.restaurantId,
            addressableType: 'Restaurant'
        });
        res.status(201).json({ message: 'Restaurant address added successfully', address });
    } catch (error) {
        console.error('Error adding restaurant address:', error);
        res.status(500).json({ message: 'Error adding restaurant address', error: error.message });
    }
};

// Get Restaurant Addresses
exports.getRestaurantAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { addressableId: req.params.restaurantId, addressableType: 'Restaurant' }
        });
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error getting restaurant addresses:', error);
        res.status(500).json({ message: 'Error getting restaurant addresses', error: error.message });
    }
};

// Update Restaurant Address
exports.updateRestaurantAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.params.restaurantId || address.addressableType !== 'Restaurant') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        address.street = street || address.street;
        address.city = city || address.city;
        address.county = county || address.county;
        address.subCounty = subCounty || address.subCounty;
        address.postalCode = postalCode || address.postalCode;
        address.latitude = latitude || address.latitude;
        address.longitude = longitude || address.longitude;

        await address.save();
        res.status(200).json({ message: 'Restaurant address updated successfully', address });
    } catch (error) {
        console.error('Error updating restaurant address:', error);
        res.status(500).json({ message: 'Error updating restaurant address', error: error.message });
    }
};

// Delete Restaurant Address
exports.deleteRestaurantAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.params.restaurantId || address.addressableType !== 'Restaurant') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        await address.destroy();
        res.status(200).json({ message: 'Restaurant address deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant address:', error);
        res.status(500).json({ message: 'Error deleting restaurant address', error: error.message });
    }
};