const express = require('express');
const { body, param } = require('express-validator');
const {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    deleteCustomer,
    customerLogout,
} = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Customer Registration
router.post('/register', registerCustomer);

// Customer Login
router.post('/login', loginCustomer);

// Get Customer Profile
router.get('/profile/:id', authMiddleware, getCustomerProfile);

// Update Customer Profile
router.patch('/profile/:id', authMiddleware, updateCustomerProfile);

// Delete Customer Account
router.delete('/profile/:id', authMiddleware, deleteCustomer);
router.post('/logout', customerLogout); // Customer logout

module.exports = router;
