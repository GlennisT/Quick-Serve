const Address = require('../models/address');
const { validationResult, body, param } = require('express-validator');

// Get All Addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll();
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Get Address by ID
exports.getAddressById = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const address = await Address.findByPk(req.params.id);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }
            res.status(200).json(address);
        } catch (error) {
            console.error('Error fetching address:', error);
            res.status(500).json({ message: 'Error fetching address', error: error.message });
        }
    }
];

// Create Address
exports.createAddress = [
    body('customer_id').isInt().withMessage('Customer ID must be an integer'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('building_name').notEmpty().withMessage('Building name is required'),
    body('house_number').notEmpty().withMessage('House number is required'),
    body('street').notEmpty().withMessage('Street is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customer_id, first_name, building_name, house_number, street } = req.body;
            const address = await Address.create({
                customer_id,
                first_name,
                building_name,
                house_number,
                street
            });
            res.status(201).json({ message: 'Address created successfully', address });
        } catch (error) {
            console.error('Error creating address:', error);
            res.status(500).json({ message: 'Error creating address', error: error.message });
        }
    }
];

// Update Address
exports.updateAddress = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('customer_id').optional().isInt().withMessage('Customer ID must be an integer'),
    body('first_name').optional(),
    body('building_name').optional(),
    body('house_number').optional(),
    body('street').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const address = await Address.findByPk(req.params.id);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }
            Object.assign(address, req.body);
            await address.save();
            res.status(200).json({ message: 'Address updated successfully', address });
        } catch (error) {
            console.error('Error updating address:', error);
            res.status(500).json({ message: 'Error updating address', error: error.message });
        }
    }
];

// Delete Address
exports.deleteAddress = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const address = await Address.findByPk(req.params.id);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }
            await address.destroy();
            res.status(200).json({ message: 'Address deleted successfully' });
        } catch (error) {
            console.error('Error deleting address:', error);
            res.status(500).json({ message: 'Error deleting address', error: error.message });
        }
    }
];
