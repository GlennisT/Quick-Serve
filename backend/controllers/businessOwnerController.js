const BusinessOwner = require('../models/businessOwner');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body, param } = require('express-validator');
const Restaurant = require('../models/restaurant');
const Address = require('../models/address');

// Business Owner Registration
exports.createBusinessOwner = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password, name, phone } = req.body;
            const existingOwner = await BusinessOwner.findOne({ where: { email } });
            if (existingOwner) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newOwner = await BusinessOwner.create({ name, email, phone, password: hashedPassword });

            res.status(201).json({ message: 'Business owner registered successfully', owner: newOwner });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering business owner', error: error.message });
        }
    }
];

// Business Owner Login
exports.loginBusinessOwner = async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await BusinessOwner.findOne({ where: { email } });

        if (!owner || !(await bcrypt.compare(password, owner.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ ownerId: owner.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get Business Owner by ID
exports.getBusinessOwnerById = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.params.ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Business owner not found' });
        }
        res.status(200).json(owner);
    } catch (error) {
        console.error('Error fetching business owner:', error);
        res.status(500).json({ message: 'Error fetching business owner', error: error.message });
    }
};

// Update Business Owner Profile
exports.updateBusinessOwnerProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const owner = await BusinessOwner.findByPk(req.ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Business owner not found' });
        }

        owner.name = name || owner.name;
        owner.phone = phone || owner.phone;
        await owner.save();

        res.status(200).json({ message: 'Profile updated successfully', owner });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete Business Owner
exports.deleteBusinessOwner = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Business owner not found' });
        }
        await owner.destroy();
        res.status(200).json({ message: 'Business owner deleted successfully' });
    } catch (error) {
        console.error('Error deleting business owner:', error);
        res.status(500).json({ message: 'Error deleting business owner', error: error.message });
    }
};

// Get Restaurants by Business Owner
exports.getRestaurantsByBusinessOwner = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({ where: { ownerId: req.ownerId } });
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

// Address Management
exports.addBusinessOwnerAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.create({
            street, city, county, subCounty, postalCode, latitude, longitude,
            addressType: 'businessOwner',
            addressableId: req.ownerId,
            addressableType: 'BusinessOwner'
        });
        res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
};

exports.getBusinessOwnerAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { addressableId: req.ownerId, addressableType: 'BusinessOwner' }
        });
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

exports.updateBusinessOwnerAddress = async (req, res) => {
    try {
        const { street, city, county, subCounty, postalCode, latitude, longitude } = req.body;
        const address = await Address.findByPk(req.params.addressId);
        
        if (!address || address.addressableId !== req.ownerId || address.addressableType !== 'BusinessOwner') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }
        
        Object.assign(address, { street, city, county, subCounty, postalCode, latitude, longitude });
        await address.save();

        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

exports.deleteBusinessOwnerAddress = async (req, res) => {
    try {
        const address = await Address.findByPk(req.params.addressId);
        if (!address || address.addressableId !== req.ownerId || address.addressableType !== 'BusinessOwner') {
            return res.status(404).json({ message: 'Address not found or unauthorized' });
        }
        await address.destroy();
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};
