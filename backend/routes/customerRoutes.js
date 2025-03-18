const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware'); // Import your auth middleware

router.post('/register', customerController.registerCustomer);
router.post('/login', customerController.loginCustomer);
router.post('/logout', authMiddleware, customerController.logout); // Add the logout route with auth middleware
router.get('/test-db', customerController.testDatabaseConnection);

module.exports = router;

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.get('/profile', customerController.getCustomerById);
router.put('/profile', customerController.updateCustomerProfile);
router.delete('/profile', customerController.deleteCustomer);
router.get('/orders', customerController.getCustomerOrderHistory);

// Address related routes
router.post('/addresses', customerController.addCustomerAddress);
router.get('/addresses', customerController.getCustomerAddresses);
router.put('/addresses/:addressId', customerController.updateCustomerAddress);
router.delete('/addresses/:addressId', customerController.deleteCustomerAddress);

module.exports = router;
