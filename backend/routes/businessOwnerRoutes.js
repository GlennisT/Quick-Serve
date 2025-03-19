const { BusinessOwner } = require('../models'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config(); 

// Utility function to handle validation errors
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
};

// Register Business Owner
exports.createBusinessOwner = async (req, res) => {
    handleValidationErrors(req, res);
    
    try {
        const { name, email, password } = req.body;
        const existingUser = await BusinessOwner.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBusinessOwner = await BusinessOwner.create({ name, email, password: hashedPassword });

        res.status(201).json({ success: true, message: "Business owner registered successfully", data: newBusinessOwner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Business Owner Login
exports.loginBusinessOwner = async (req, res) => {
    handleValidationErrors(req, res);

    try {
        const { email, password } = req.body;
        const owner = await BusinessOwner.findOne({ where: { email } });

        if (!owner || !await bcrypt.compare(password, owner.password)) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: owner.id, email: owner.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get Business Owner Profile
exports.getBusinessOwnerById = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.user.id, { attributes: { exclude: ['password'] } });

        if (!owner) {
            return res.status(404).json({ success: false, message: "Business owner not found" });
        }

        res.json({ success: true, data: owner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Business Owner Profile
exports.updateBusinessOwnerProfile = async (req, res) => {
    handleValidationErrors(req, res);

    try {
        const { name, email, password } = req.body;
        const owner = await BusinessOwner.findByPk(req.user.id);

        if (!owner) {
            return res.status(404).json({ success: false, message: "Business owner not found" });
        }

        if (email && email !== owner.email) {
            const emailExists = await BusinessOwner.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            owner.email = email;
        }

        if (name) owner.name = name;
        if (password) owner.password = await bcrypt.hash(password, 10);

        await owner.save();
        res.json({ success: true, message: "Profile updated successfully", data: owner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Delete Business Owner Profile
exports.deleteBusinessOwner = async (req, res) => {
    try {
        const owner = await BusinessOwner.findByPk(req.user.id);

        if (!owner) {
            return res.status(404).json({ success: false, message: "Business owner not found" });
        }

        await owner.destroy();
        res.json({ success: true, message: "Business owner deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get Restaurants by Business Owner
exports.getRestaurantsByBusinessOwner = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({ where: { ownerId: req.user.id } });

        res.json({ success: true, data: restaurants });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
