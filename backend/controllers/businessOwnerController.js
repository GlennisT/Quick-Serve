const BusinessOwner = require('../models/BusinessOwner');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Register a new business owner
exports.registerBusinessOwner = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if email already exists
        const existingOwner = await BusinessOwner.findOne({ where: { email: req.body.email } });
        if (existingOwner) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create the business owner
        const newOwner = await BusinessOwner.create(req.body);
        res.status(201).json({ message: 'Business owner registered successfully', owner: newOwner });
    } catch (error) {
        res.status(500).json({ message: 'Error registering business owner', error: error.message });
    }
    // Validate mpesaNumber (optional)
if (!req.body.mpesaNumber || !/^\d{6,10}$/.test(req.body.mpesaNumber)) {
    return res.status(400).json({ message: 'Invalid Mpesa Paybill number. It must be 6 to 10 digits.' });
}

};

// Get all business owners
exports.getBusinessOwners = async (req, res) => {
    try {
        const owners = await BusinessOwner.findAll();
        res.status(200).json(owners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business owners', error: error.message });
    }
};

// Get a business owner by ID
exports.getBusinessOwnerById = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.params.id);
        if (!owner) return res.status(404).json({ message: 'Business owner not found' });
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business owner', error: error.message });
    }
};

// Update a business owner
exports.updateBusinessOwner = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.params.id);
        if (!owner) return res.status(404).json({ message: 'Business owner not found' });
    // If updating mpesaNumber, validate it
   if (req.body.mpesaNumber && !/^\d{6,10}$/.test(req.body.mpesaNumber)) {
    return res.status(400).json({ message: 'Invalid Mpesa Paybill number. It must be 6 to 10 digits.' });
}

        // Update only provided fields
        Object.assign(owner, req.body);
        await owner.save();
        res.status(200).json({ message: 'Business owner updated successfully', owner });
    } catch (error) {
        res.status(500).json({ message: 'Error updating business owner', error: error.message });
    }
};

// Delete a business owner
exports.deleteBusinessOwner = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.params.id);
        if (!owner) return res.status(404).json({ message: 'Business owner not found' });

        await owner.destroy();
        res.status(200).json({ message: 'Business owner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting business owner', error: error.message });
    }
};
