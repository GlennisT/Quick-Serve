const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body, param } = require('express-validator');
const Address = require('../models/address');
const Order = require('../models/order');

// Customer Registration
exports.createCustomer = [
    // Validation rules...
    async (req, res) => {
        // ... registration logic ...
    }
];

// Customer Login
exports.loginCustomer = async (req, res) => {
    // ... login logic ...
};

// Get Customer by ID
exports.getCustomerById = [
    // Validation rules...
    async (req, res) => {
        // ... get customer logic ...
    }
];

// Update Customer Profile
exports.updateCustomerProfile = async (req, res) => {
    // ... update profile logic ...
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    // ... delete customer logic ...
};

// Get Customer Order History
exports.getCustomerOrderHistory = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { customerId: req.customerId }, // Get customer Id from JWT
            include: ['Restaurant'] // Include restaurant info
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting order history:', error);
        res.status(500).json({ message: 'Error getting order history', error: error.message });
    }
};

// Add Customer Address
exports.addCustomerAddress = async (req, res) => {
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
            addressType: 'customer',
            addressableId: req.customerId, // Get customer Id from JWT.
            addressableType: 'Customer'
        });
        res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
};

// Get Customer Addresses
exports.getCustomerAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { addressableId: req.customerId, addressableType: 'Customer' } // Get customer Id from JWT.
        });
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error getting addresses:', error);
        res.status(500).json({ message: 'Error getting addresses', error: error.message });
    }
};

// Update Customer Address
exports.updateCustomerAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.customerId || address.addressableType !== 'Customer') {
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

// Delete Customer Address
exports.deleteCustomerAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.addressId);

        if (!address || address.addressableId !== req.customerId || address.addressableType !== 'Customer') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }

        await address.destroy();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};

// customerController.js
exports.logout = (req, res) => {
    try {
      // Clear the JWT token or session
      res.clearCookie('token'); // Clear the token cookie
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed', error: error.message });
    }
  };