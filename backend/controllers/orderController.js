const Order = require('../models/order'); // Import your Order model
const { validationResult, body, param } = require('express-validator'); // Import express-validator

// Create a new order
exports.createOrder = [
    body('customer_id').isInt().withMessage('Customer ID must be an integer'),
    body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    body('total_price').isDecimal({ force_decimal: true, decimal_digits: '2,' }).withMessage('Total price must be a decimal with 2 digits'),
    body('payment_method').isIn(['Cash', 'M-Pesa']).withMessage('Invalid payment method'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customer_id, restaurant_id, total_price, payment_method } = req.body;
            const order = await Order.create({
                customer_id,
                restaurant_id,
                total_price,
                payment_method,
            });
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];

// Get order by ID
exports.getOrderById = [
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.order_id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];

// Get all orders for a specific customer
exports.getOrdersByCustomer = [
    param('customer_id').isInt().withMessage('Customer ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const orders = await Order.findAll({ where: { customer_id: req.params.customer_id } });
            res.json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];

// Update order status
exports.updateOrderStatus = [
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    body('order_status').isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid order status'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.order_id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            await order.update({ order_status: req.body.order_status });
            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];

// Update payment status
exports.updatePaymentStatus = [
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    body('payment_status').isIn(['Pending', 'Paid', 'Failed']).withMessage('Invalid payment status'),
    body('transaction_id').optional().isString().withMessage('Transaction ID must be a string'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.order_id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            await order.update({ payment_status: req.body.payment_status, transaction_id: req.body.transaction_id });
            res.json({ message: 'Payment status updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];

// Delete an order
exports.deleteOrder = [
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.order_id);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            await order.destroy();
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
];