const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');
const { validateOrderCreation, validateOrderStatusUpdate } = require('../validation/orderValidation');
const validateRequest = require('../middleware/validationMiddleware');

// Protected Routes (Authentication Required)
router.use(authMiddleware); // Apply authMiddleware to all routes below

router.post('/', validateOrderCreation, validateRequest, orderController.createOrder); // Only customers who are logged in can create an order.
router.get('/customer', orderController.getOrdersByCustomer); // Only customers who are logged in can see their orders.
router.get('/restaurant/:restaurantId', orderController.getOrdersByRestaurant); // Only restaurant owners who are logged in can see restaurant orders.
router.put('/:id', validateOrderStatusUpdate, validateRequest, orderController.updateOrderStatus); // only restaurant owners who are logged in can update order status.

// Public Routes (No Authentication Required)
router.get('/:id', orderController.getOrderById); // Anyone can view an order by ID. This is useful for order tracking.
module.exports = router;