const Customer = require('../models/customer');
const { validationResult, body, param } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Get Customer by ID
exports.getCustomerProfile = [
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

// Register Customer
exports.registerCustomer = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { first_name, last_name, email, password, street, building, house_number } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const customer = await Customer.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                street,
                building,
                house_number
            });

            res.status(201).json({ message: 'Customer created successfully', customer });
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ message: 'Error creating customer', error: error.message });
        }
    }
];

// Customer Login
exports.loginCustomer = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            const customer = await Customer.findOne({ where: { email } });

            if (!customer) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
];

// Update Customer Profile
exports.updateCustomerProfile = [
    param('id').isInt().withMessage('ID must be an integer'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
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
