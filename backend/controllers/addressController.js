const Address = require('../models/address');
const { validationResult, body, param, query } = require('express-validator');

// Get All Addresses
exports.getAddress = async (req, res) => {
    try {
        const addresses = await Address.findAll();
        res.status(200).json(addresses);
    } catch (error) {
        console.error('Error getting addresses:', error);
        res.status(500).json({ message: 'Error getting addresses', error: error.message });
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
            console.error('Error getting address:', error);
            res.status(500).json({ message: 'Error getting address', error: error.message });
        }
    }
];

// Create Address
exports.createAddress = [
    body('street').notEmpty().withMessage('Street is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('county').notEmpty().withMessage('County is required'),
    body('subCounty').notEmpty().withMessage('Sub-county is required'),
    body('postalCode').optional(),
    body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal number'),
    body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal number'),
    body('addressType').isIn(['customer', 'business']).withMessage('Invalid address type'),
    body('addressableId').isInt().withMessage('Addressable ID must be an integer'),
    body('addressableType').isIn(['Customer', 'BusinessOwner']).withMessage('Invalid addressable type'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { street, city, county, subCounty, postalCode, latitude, longitude, addressType, addressableId, addressableType } = req.body;
            const address = await Address.create({
                street,
                city,
                county,
                subCounty,
                postalCode,
                latitude,
                longitude,
                addressType,
                addressableId,
                addressableType
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
    body('street').optional(),
    body('city').optional(),
    body('county').optional(),
    body('subCounty').optional(),
    body('postalCode').optional(),
    body('latitude').optional().isDecimal().withMessage('Latitude must be a decimal number'),
    body('longitude').optional().isDecimal().withMessage('Longitude must be a decimal number'),
    body('addressType').optional().isIn(['customer', 'business']).withMessage('Invalid address type'),
    body('addressableId').optional().isInt().withMessage('Addressable ID must be an integer'),
    body('addressableType').optional().isIn(['Customer', 'BusinessOwner']).withMessage('Invalid addressable type'),
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

// Get Addresses by Addressable ID and Type
exports.getAddressesByAddressable = [
    query('addressableId').isInt().withMessage('Addressable ID must be an integer'),
    query('addressableType').isIn(['Customer', 'BusinessOwner']).withMessage('Invalid addressable type'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { addressableId, addressableType } = req.query;
            const addresses = await Address.findAll({
                where: { addressableId, addressableType }
            });
            res.status(200).json(addresses);
        } catch (error) {
            console.error('Error getting addresses:', error);
            res.status(500).json({ message: 'Error getting addresses', error: error.message });
        }
    }
];
