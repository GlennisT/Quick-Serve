const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

// Apply authentication middleware to all order routes
router.use(authMiddleware);

// Customer routes
router.post('/', orderController.createOrder); // Place a new order
router.get('/customer', orderController.getCustomerOrders); // Get logged-in customer's orders
router.get('/:id', orderController.getOrderById); // Get order details by ID

// Restaurant routes
router.get('/restaurant', orderController.getRestaurantOrders); // Get orders for logged-in restaurant owner
router.put('/:id/status', orderController.updateOrderStatus); // Update order status
router.delete('/:id', orderController.cancelOrder); // Cancel an order

module.exports = router;
