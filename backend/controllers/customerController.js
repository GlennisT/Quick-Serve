const Customer = require('../models/customer');
const { validationResult, body, param } = require('express-validator');

// Get All Customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

// Get Customer by ID
exports.getCustomerById = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.status(200).json(customer);
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ message: 'Error fetching customer', error: error.message });
        }
    }
];

// Create Customer
exports.createCustomer = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('street').optional(),
    body('building').optional(),
    body('house_number').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { first_name, last_name, email, password, street, building, house_number } = req.body;
            const customer = await Customer.create({
                first_name,
                last_name,
                email,
                password,
                street: street || null,
                building: building || null,
                house_number: house_number || null
            });
            res.status(201).json({ message: 'Customer created successfully', customer });
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ message: 'Error creating customer', error: error.message });
        }
    }
];

// Update Customer
exports.updateCustomer = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('first_name').optional(),
    body('last_name').optional(),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional(),
    body('street').optional(),
    body('building').optional(),
    body('house_number').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            Object.assign(customer, req.body);
            await customer.save();
            res.status(200).json({ message: 'Customer updated successfully', customer });
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({ message: 'Error updating customer', error: error.message });
        }
    }
];

// Delete Customer
exports.deleteCustomer = [
    param('id').isInt().withMessage('ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const customer = await Customer.findByPk(req.params.id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            await customer.destroy();
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (error) {
            console.error('Error deleting customer:', error);
            res.status(500).json({ message: 'Error deleting customer', error: error.message });
        }
    }
];
