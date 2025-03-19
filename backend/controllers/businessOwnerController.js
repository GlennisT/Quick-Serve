const BusinessOwner = require('../models/businessOwner');
const { validationResult, body, param } = require('express-validator');

// Get All Business Owners
exports.getBusinessOwners = async (req, res) => {
    try {
        const owners = await BusinessOwner.findAll();
        res.status(200).json(owners);
    } catch (error) {
        console.error('Error fetching business owners:', error);
        res.status(500).json({ message: 'Error fetching business owners', error: error.message });
    }
};

// Get Business Owner by ID
exports.getBusinessOwnerById = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const owner = await BusinessOwner.findByPk(req.params.id);
            if (!owner) {
                return res.status(404).json({ message: 'Business owner not found' });
            }
            res.status(200).json(owner);
        } catch (error) {
            console.error('Error fetching business owner:', error);
            res.status(500).json({ message: 'Error fetching business owner', error: error.message });
        }
    }
];

// Create Business Owner
exports.createBusinessOwner = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('business_name').notEmpty().withMessage('Business name is required'),
    body('business_location').notEmpty().withMessage('Business location is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('business_id').notEmpty().withMessage('Business ID is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { first_name, last_name, business_name, business_location, email, password, logo, business_id } = req.body;
            const owner = await BusinessOwner.create({
                first_name,
                last_name,
                business_name,
                business_location,
                email,
                password,
                logo: logo || null, // Optional logo field
                business_id
            });
            res.status(201).json({ message: 'Business owner created successfully', owner });
        } catch (error) {
            console.error('Error creating business owner:', error);
            res.status(500).json({ message: 'Error creating business owner', error: error.message });
        }
    }
];

// Update Business Owner
exports.updateBusinessOwner = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('first_name').optional(),
    body('last_name').optional(),
    body('business_name').optional(),
    body('business_location').optional(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional(),
    body('logo').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const owner = await BusinessOwner.findByPk(req.params.id);
            if (!owner) {
                return res.status(404).json({ message: 'Business owner not found' });
            }
            Object.assign(owner, req.body);
            await owner.save();
            res.status(200).json({ message: 'Business owner updated successfully', owner });
        } catch (error) {
            console.error('Error updating business owner:', error);
            res.status(500).json({ message: 'Error updating business owner', error: error.message });
        }
    }
];

// Delete Business Owner
exports.deleteBusinessOwner = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const owner = await BusinessOwner.findByPk(req.params.id);
            if (!owner) {
                return res.status(404).json({ message: 'Business owner not found' });
            }
            await owner.destroy();
            res.status(200).json({ message: 'Business owner deleted successfully' });
        } catch (error) {
            console.error('Error deleting business owner:', error);
            res.status(500).json({ message: 'Error deleting business owner', error: error.message });
        }
    }
];
