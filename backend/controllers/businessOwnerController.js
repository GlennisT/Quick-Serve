const BusinessOwner = require('../models/businessOwner');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body, param } = require('express-validator');
const Restaurant = require('../models/restaurant');
const Address = require('../models/address');

// Business Owner Registration
exports.createBusinessOwner = [
    // ... validation ...
    async (req, res) => {
        // ... registration logic ...
    }
];

// Business Owner Login
exports.loginBusinessOwner = async (req, res) => {
    // ... login logic ...
};

// Get Business Owner by ID
exports.getBusinessOwnerById = [
    // ... validation ...
    async (req, res) => {
        // ... get logic ...
    }
];

// Update Business Owner Profile
exports.updateBusinessOwnerProfile = async (req, res) => {
    // ... update logic ...
};

// Delete Business Owner
exports.deleteBusinessOwner = async (req, res) => {
    // ... delete logic ...
};

// Get Restaurants by Business Owner
exports.getRestaurantsByBusinessOwner = async (req, res) => {
    // ... get restaurants logic ...
};

// Add Business Owner Address
exports.addBusinessOwnerAddress = async (req, res) => {
    // ... add address logic ...
};

// Get Business Owner Addresses
exports.getBusinessOwnerAddresses = async (req, res) => {
    // ... get addresses logic ...
};

// Update Business Owner Address
exports.updateBusinessOwnerAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.businessOwnerId || address.addressableType !== 'BusinessOwner') {
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
        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Delete Business Owner Address
exports.deleteBusinessOwnerAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.businessOwnerId || address.addressableType !== 'BusinessOwner') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        await address.destroy();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};