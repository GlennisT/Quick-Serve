const Order = require('../models/order');
const { validationResult, body, param } = require('express-validator');

// Get All Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get Order by ID
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
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ message: 'Error fetching order', error: error.message });
        }
    }
];

// Create Order
exports.createOrder = [
    body('customer_id').isInt().withMessage('Customer ID is required and must be an integer'),
    body('restaurant_id').isInt().withMessage('Restaurant ID is required and must be an integer'),
    body('total_price').isFloat({ gt: 0 }).withMessage('Total price must be a positive number'),
    body('payment_method').isIn(['Cash', 'M-Pesa']).withMessage('Invalid payment method'),
    body('payment_status').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('Invalid payment status'),
    body('order_status').optional().isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid order status'),
    body('transaction_id').optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const {
                customer_id,
                restaurant_id,
                total_price,
                payment_method,
                payment_status = 'Pending',
                order_status = 'Pending',
                transaction_id = null
            } = req.body;

            const order = await Order.create({
                customer_id,
                restaurant_id,
                total_price,
                payment_method,
                payment_status,
                order_status,
                transaction_id
            });

            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Error creating order', error: error.message });
        }
    }
];

// Update Order
exports.updateOrder = [
    param('order_id').isInt().withMessage('Order ID must be an integer'),
    body('payment_status').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('Invalid payment status'),
    body('order_status').optional().isIn(['Pending', 'Processing', 'Completed', 'Cancelled']).withMessage('Invalid order status'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.order_id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            Object.assign(order, req.body);
            await order.save();

            res.status(200).json({ message: 'Order updated successfully', order });
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ message: 'Error updating order', error: error.message });
        }
    }
];

// Delete Order
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
                return res.status(404).json({ message: 'Order not found' });
            }
            await order.destroy();
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({ message: 'Error deleting order', error: error.message });
        }
    }
];
