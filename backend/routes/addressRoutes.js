const express = require('express');
const router = express.Router();
const {
    getAddress,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressesByAddressable
} = require('../controllers/addressController');

// Route to get all addresses
router.get('/addresses', getAddress);

// Route to get a specific address by ID
router.get('/addresses/:id', getAddressById);

// Route to create a new address
router.post('/addresses', createAddress);

// Route to update an address by ID
router.put('/addresses/:id', updateAddress);

// Route to delete an address by ID
router.delete('/addresses/:id', deleteAddress);

// Route to get addresses by addressable ID and type
router.get('/addresses/search', getAddressesByAddressable);

module.exports = router;
