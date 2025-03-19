const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult, body, param } = require('express-validator');
const Address = require('../models/address');
const Order = require('../models/order');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Ensure you store this in an environment variable

// Customer Registration
exports.registerCustomer = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password } = req.body;
            const existingCustomer = await Customer.findOne({ where: { email } });
            if (existingCustomer) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const customer = await Customer.create({ name, email, password: hashedPassword });
            
            res.status(201).json({ message: 'Registration successful', customer });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering customer', error: error.message });
        }
    }
];

// Customer Login
exports.loginCustomer = async (req, res) => {
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

        const token = jwt.sign({ id: customer.id }, SECRET_KEY, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ message: 'Error retrieving customer', error: error.message });
    }
};

// Update Customer Profile
exports.updateCustomerProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const customer = await Customer.findByPk(req.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            customer.email = email;
        }

        customer.name = name || customer.name;
        if (password) {
            customer.password = await bcrypt.hash(password, 10);
        }

        await customer.save();
        res.status(200).json({ message: 'Profile updated successfully', customer });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.destroy();
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

// Customer Logout
exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};