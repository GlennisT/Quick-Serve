const Business = require('../models/Business');

// Create a new business
const createBusiness = async (req, res) => {
    try {
        const { name, location, description } = req.body;

        // Validate required fields
        if (!name || !location || !description) {
            return res.status(400).json({ message: 'All fields (name, location, description) are required' });
        }

        // Create a new business instance
        const newBusiness = new Business({
            name,
            location,
            description,
            owner: req.user._id, // Assuming the user is authenticated and their ID is stored in req.user
        });

        // Save the business to the database
        await newBusiness.save();

        res.status(201).json({ message: 'Business created successfully', business: newBusiness });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating business', error });
    }
};

// Get all businesses
const getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching businesses', error });
    }
};

// Get a business by ID
const getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);
        
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        res.status(200).json(business);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching business', error });
    }
};

// Update business details
const updateBusiness = async (req, res) => {
    try {
        const { name, location, description } = req.body;
        
        // Validate required fields
        if (!name && !location && !description) {
            return res.status(400).json({ message: 'At least one field (name, location, description) must be provided for update' });
        }

        const business = await Business.findById(req.params.id);

        // Check if business exists
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Check if the authenticated user is the business owner
        if (business.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this business' });
        }

        // Update business
        business.name = name || business.name;
        business.location = location || business.location;
        business.description = description || business.description;

        await business.save();

        res.status(200).json({ message: 'Business updated successfully', business });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating business', error });
    }
};

// Delete a business
const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);

        // Check if business exists
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Check if the authenticated user is the business owner
        if (business.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this business' });
        }

        // Delete business
        await business.remove();

        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting business', error });
    }
};

module.exports = {
    createBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
};
