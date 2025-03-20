// controllers/deliveriesController.js
const Delivery = require('../models/deliveries');
const Order = require('../models/order');
const { validationResult, body, param } = require('express-validator');

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deliveries', error: error.message });
    }
};

// Get delivery by ID
exports.getDeliveryById = [
    param('id').isInt().withMessage('Delivery ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const delivery = await Delivery.findByPk(req.params.id);
            if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
            res.status(200).json(delivery);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching delivery', error: error.message });
        }
    }
];

// Create a new delivery
exports.createDelivery = [
    body('order_id').isInt().withMessage('Order ID must be an integer'),
    body('delivery_status').isIn(['Pending', 'Out for Delivery', 'Delivered', 'Failed']).withMessage('Invalid status'),
    body('estimated_time').optional().matches(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).withMessage('Invalid time format'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const { order_id, delivery_status, estimated_time, delivery_person, contact_number } = req.body;
            const order = await Order.findByPk(order_id);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            const delivery = await Delivery.create({
                order_id, delivery_status, estimated_time, delivery_person, contact_number
            });
            res.status(201).json({ message: 'Delivery created successfully', delivery });
        } catch (error) {
            res.status(500).json({ message: 'Error creating delivery', error: error.message });
        }
    }
];

// Update delivery status
exports.updateDeliveryStatus = [
    param('id').isInt().withMessage('Delivery ID must be an integer'),
    body('delivery_status').isIn(['Pending', 'Out for Delivery', 'Delivered', 'Failed']).withMessage('Invalid status'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const delivery = await Delivery.findByPk(req.params.id);
            if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

            delivery.delivery_status = req.body.delivery_status;
            await delivery.save();

            res.status(200).json({ message: 'Delivery status updated successfully', delivery });
        } catch (error) {
            res.status(500).json({ message: 'Error updating delivery status', error: error.message });
        }
    }
];

// Delete delivery
exports.deleteDelivery = [
    param('id').isInt().withMessage('Delivery ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        try {
            const delivery = await Delivery.findByPk(req.params.id);
            if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

            await delivery.destroy();
            res.status(200).json({ message: 'Delivery deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting delivery', error: error.message });
        }
    }
];