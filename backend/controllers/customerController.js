const Customer = require('../models/customer');
const { validationResult, body, param } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService'); // Import sendEmail
const crypto = require('crypto');
const { sendAtSms } = require('../services/atService'); // Import Africa's Talking SMS

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

// Customer Logout
exports.customerLogout = (req, res) => {
    // Implement logout logic here (e.g., invalidate session, clear token)
    // Example (using sessions):
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};


// Register Customer
exports.registerCustomer = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //customerController.js or businessOwnerController.js
        const phoneRegex = /^\+254\d{9,10}$/;
        if (!phoneRegex.test(req.body.phone_number)) {
            return res.status(400).json({message: "Invalid phone number format. Must be +2547XXXXXXXX or +2541XXXXXXXX"});
        }
        try {
            const { first_name, last_name, email, password, street, building, house_number, phone_number } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const customer = await Customer.create({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                street,
                building,
                house_number,
                phone_number
            });

            // Generate verification token
            const verificationToken = crypto.randomBytes(20).toString('hex');

            // Store token in database
            await Customer.update({ verificationToken, isVerified: false }, { where: { id: customer.id } });

            // Send verification email
            const verificationLink = `http://your-domain.com/api/customers/verify/${verificationToken}`;
            await sendEmail(email, 'Verify Your QuickServe Account', `Please click the following link to verify your account: ${verificationLink}`);

            // Send SMS with retry logic and fallback (Using Africa's Talking)
            let smsSent = false;
            let retryCount = 0;
            const maxRetries = 3;

            while (!smsSent && retryCount < maxRetries) {
                try {
                    await sendAtSms(phone_number, 'Welcome to our QuickServe!'); // Use sendAtSms
                    smsSent = true;
                } catch (smsError) {
                    console.error(`AT SMS retry ${retryCount + 1} failed:`, smsError);
                    retryCount++;
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                }
            }

            if (!smsSent) {
                console.error(`AT SMS failed after ${maxRetries} retries.`); // AT SMS
                // Fallback: Send email notification
                await sendEmail(email, 'QuickServe Registration Alert', 'SMS notification failed. Please check your account.');
                // Optional: Log SMS failure to database for analysis
            }

            res.status(201).json({ message: 'Customer created successfully. Please check your email for verification.', customer });

        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ message: 'Email address already exists' }); // Send 400 for duplicate email
            }
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

            try {
                await sendAtSms(customer.phone_number, 'You have successfully logged in.'); // Use sendAtSms
            } catch (smsError) {
                console.error('AT SMS error:', smsError); // AT SMS
                // Handle SMS error (e.g., log, but don't fail login)
            }

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
