const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware

// Public Routes (No Authentication)
router.post('/register', customerController.registerCustomer);
router.post('/login', customerController.loginCustomer);
router.get('/test-db', customerController.testDatabaseConnection);

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/logout', customerController.logout); // Logout should be protected
router.get('/profile', customerController.getCustomerById);
router.put('/profile', customerController.updateCustomerProfile);
router.delete('/profile', customerController.deleteCustomer);
router.get('/orders', customerController.getCustomerOrderHistory);

// Address-related Routes
router.post('/addresses', customerController.addCustomerAddress);
router.get('/addresses', customerController.getCustomerAddresses);
router.put('/addresses/:addressId', customerController.updateCustomerAddress);
router.delete('/addresses/:addressId', customerController.deleteCustomerAddress);

module.exports = router;
