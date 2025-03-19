const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const { validationResult, body, param } = require('express-validator');
const { sequelize } = require('../config/database'); // Assuming Sequelize instance is configured

// Helper function for error handling
const handleError = (res, error, message = 'Server error') => {
    console.error(message, error);
    return res.status(500).json({ message, error: error.message });
};

// Create Order
exports.createOrder = [
    body('customerId').isInt().withMessage('Customer ID must be an integer'),
    body('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
    body('totalAmount').isDecimal().withMessage('Total amount must be a decimal'),
    body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
    body('items.*.menuItemId').isInt().withMessage('Menu Item ID must be an integer'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isDecimal().withMessage('Price must be a decimal'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { customerId, restaurantId, totalAmount, items } = req.body;

        const transaction = await sequelize.transaction();
        try {
            // Create order
            const order = await Order.create(
                { customerId, restaurantId, totalAmount, orderStatus: 'pending' },
                { transaction }
            );

            // Create order items
            const orderItems = items.map(item => ({
                orderId: order.id,
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: item.price
            }));

            await OrderItem.bulkCreate(orderItems, { transaction });

            await transaction.commit();
            res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            await transaction.rollback();
            handleError(res, error, 'Error creating order');
        }
    }
];

// Get Order by ID
exports.getOrderById = [
    param('id').isInt().withMessage('Order ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
            if (!order) return res.status(404).json({ message: 'Order not found' });

            res.status(200).json(order);
        } catch (error) {
            handleError(res, error, 'Error retrieving order');
        }
    }
];

// Update Order Status
exports.updateOrderStatus = [
    param('id').isInt().withMessage('Order ID must be an integer'),
    body('orderStatus')
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const [updated] = await Order.update(
                { orderStatus: req.body.orderStatus },
                { where: { id: req.params.id } }
            );

            if (!updated) return res.status(404).json({ message: 'Order not found' });

            res.status(200).json({ message: 'Order status updated successfully' });
        } catch (error) {
            handleError(res, error, 'Error updating order status');
        }
    }
];

// Cancel Order
exports.cancelOrder = [
    param('id').isInt().withMessage('Order ID must be an integer'),
    async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            // Only allow cancellation if the order is still pending or processing
            if (['shipped', 'delivered'].includes(order.orderStatus)) {
                return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
            }

            await order.update({ orderStatus: 'cancelled' });
            res.status(200).json({ message: 'Order cancelled successfully' });
        } catch (error) {
            handleError(res, error, 'Error cancelling order');
        }
    }
];

// Get Orders by Customer (Uses customerId from JWT)
exports.getOrdersByCustomer = async (req, res) => {
    try {
        const customerId = req.customerId; // Assuming extracted from JWT middleware
        if (!customerId) return res.status(401).json({ message: 'Unauthorized' });

        const orders = await Order.findAll({
            where: { customerId },
            include: [OrderItem],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        handleError(res, error, 'Error retrieving customer orders');
    }
};

// Get Orders by Restaurant
exports.getOrdersByRestaurant = [
    param('restaurantId').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const orders = await Order.findAll({
                where: { restaurantId: req.params.restaurantId },
                include: [OrderItem],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json(orders);
        } catch (error) {
            handleError(res, error, 'Error retrieving restaurant orders');
        }
    }
];