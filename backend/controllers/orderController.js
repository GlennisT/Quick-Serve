const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const { validationResult, body, param } = require('express-validator');

// Create Order
exports.createOrder = [
    body('customerId').isInt(),
    body('restaurantId').isInt(),
    body('totalAmount').isDecimal(),
    body('items').isArray(),
    body('items.*.menuItemId').isInt(),
    body('items.*.quantity').isInt(),
    body('items.*.price').isDecimal(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { customerId, restaurantId, totalAmount, items } = req.body;
            const order = await Order.create({
                customerId,
                restaurantId,
                totalAmount,
                orderStatus: 'pending' // Default order status
            });

            // Create Order Items
            for (const item of items) {
                await OrderItem.create({
                    orderId: order.id,
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    price: item.price
                });
            }

            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Error creating order', error: error.message });
        }
    }
];

// Get Order by ID
exports.getOrderById = [
    param('id').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [OrderItem]
            });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            console.error('Error getting order:', error);
            res.status(500).json({ message: 'Error getting order', error: error.message });
        }
    }
];

// Update Order Status
exports.updateOrderStatus = [
    param('id').isInt(),
    body('orderStatus').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            order.orderStatus = req.body.orderStatus;
            await order.save();
            res.status(200).json({ message: 'Order status updated successfully', order });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Error updating order status', error: error.message });
        }
    }
];

// Get Orders by Customer
exports.getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.customerId; // Get customerId from JWT
        const orders = await Order.findAll({
            where: { customerId: customerId },
            include: [OrderItem]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders by customer:', error);
        res.status(500).json({ message: 'Error getting orders by customer', error: error.message });
    }
};

// Get Orders by Restaurant
exports.getOrdersByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const orders = await Order.findAll({
            where: { restaurantId: restaurantId },
            include: [OrderItem]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error getting orders by restaurant:', error);
        res.status(500).json({ message: 'Error getting orders by restaurant', error: error.message });
    }
};