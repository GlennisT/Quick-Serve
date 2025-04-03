const BusinessOwner = require('../models/businessOwner');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService'); // Import sendEmail
const crypto = require('crypto');
const { sendAtSms } = require('../services/atService'); // Import Africa's Talking SMS

// Register a new business owner
exports.registerBusinessOwner = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const phoneRegex = /^\+254\d{9,10}$/;
    if (!phoneRegex.test(req.body.phone_number)) {
    return res.status(400).json({message: "Invalid phone number format. Must be +2547XXXXXXXX or +2541XXXXXXXX"});
    }
    try {
        // Check if email already exists
        const existingOwner = await BusinessOwner.findOne({ where: { email: req.body.email } });
        if (existingOwner) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create the business owner
        const { phone_number, ...ownerData } = req.body;
        const newOwner = await BusinessOwner.create({ ...ownerData, phone_number });

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Store token in database
        await BusinessOwner.update({ verificationToken, isVerified: false }, { where: { id: newOwner.id } });

        // Send verification email
        const verificationLink = `http://your-domain.com/api/business/verify/${verificationToken}`;
        await sendEmail(req.body.email, 'Verify Your QuickServe Business Account', `Please click the following link to verify your account: ${verificationLink}`);

        // Send SMS with retry logic and fallback (Using Africa's Talking)
        let smsSent = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!smsSent && retryCount < maxRetries) {
            try {
                await sendAtSms(phone_number, 'You have successfully created an account.'); // Use sendAtSms
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
            await sendEmail(req.body.email, 'QuickServe Business Registration Alert', 'SMS notification failed. Please check your account.');
            // Optional: Log SMS failure to database for analysis
        }

        res.status(201).json({ message: 'Business owner registered successfully. Please check your email for verification.', owner: newOwner });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Email address already exists' }); // Send 400 for duplicate email
        }
        res.status(500).json({ message: 'Error registering business owner', error: error.message });
    }

    // Validate mpesaNumber (optional)
    if (req.body.mpesaNumber && !/^\d{6,10}$/.test(req.body.mpesaNumber)) {
        return res.status(400).json({ message: 'Invalid Mpesa Paybill number. It must be 6 to 10 digits.' });
    }
    
};


// Verification route
exports.verifyBusinessOwner = async (req, res) => {
    try {
        const { token } = req.params;
        const owner = await BusinessOwner.findOne({ where: { verificationToken: token } });

        if (!owner) {
            return res.status(404).json({ message: 'Invalid verification token' });
        }

        await BusinessOwner.update({ isVerified: true, verificationToken: null }, { where: { id: owner.id } });

        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying account', error: error.message });
    }
};

exports.loginBusinessOwner = async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await BusinessOwner.findOne({ where: { email } });

        if (!owner) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, owner.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: owner.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send SMS after successful login with retry logic and fallback (Using Africa's Talking)
        let smsSent = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!smsSent && retryCount < maxRetries) {
            try {
                await sendAtSms(owner.phone_number, "You have logged into your business account."); // Use sendAtSms
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
            await sendEmail(owner.email, 'QuickServe Business Login Alert', 'SMS login notification failed. Please check your account.');
            // Optional: Log SMS failure to database for analysis
        }

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Business Owner Logout
exports.businessLogout = (req, res) => {
    // Implement logout logic here (e.g., invalidate session, clear token)
    // Example (using sessions):
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
};


// Get Business Owner Profile
exports.getBusinessProfile = async (req, res) => {
    try {
        // Assuming you have a way to identify the logged-in owner (e.g., from session or token)
        const ownerId = req.session.businessOwnerId; // Or req.user.id from JWT
        const owner = await BusinessOwner.findByPk(ownerId);
        if (!owner) return res.status(404).json({ message: 'Business owner profile not found' });
        res.status(200).json(owner);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching business owner profile', error: error.message });
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
// ... (your existing functions)

// Get Business Owner Dashboard Data
exports.getBusinessDashboardData = async (req, res) => {
    try {
        // Implement logic to fetch dashboard data (e.g., total orders, revenue, etc.)
        // Example (replace with your actual data retrieval logic):
        const ownerId = req.session.businessOwnerId; // Or req.user.id from JWT
        // Example logic, you will need to replace with your actual data retrieval.
        const totalOrders = await Order.count({ where: { businessOwnerId: ownerId } });
        const totalRevenue = await Order.sum('totalAmount', { where: { businessOwnerId: ownerId } });

        res.status(200).json({ totalOrders, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};