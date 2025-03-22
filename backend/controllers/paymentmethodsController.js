const PaymentMethod = require('../models/paymentmethods');
const { validationResult } = require('express-validator');

// Get all payment methods by restaurant ID
exports.getPaymentMethodsByRestaurant = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { restaurant_id } = req.params;
        const paymentMethods = await PaymentMethod.findAll({
            where: { restaurant_id },
            attributes: ['id', 'restaurant_id', 'method', 'mpesa_paybill', 'created_at'],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
    }
};

// Get a single payment method by ID
exports.getPaymentMethodById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const paymentMethod = await PaymentMethod.findByPk(req.params.id,  {
            attributes: ['id', 'restaurant_id', 'method', 'mpesa_paybill', 'created_at']
        });

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        console.error('Error fetching payment method:', error);
        res.status(500).json({ message: 'Error fetching payment method', error: error.message });
    }
};

// Create a new payment method
exports.createPaymentMethod = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { restaurant_id, method, mpesa_paybill } = req.body;
        if (method.toLowerCase() === 'mpesa' && (!mpesa_paybill || !/^\d{6,10}$/.test(mpesa_paybill))) {
            return res.status(400).json({ message: 'Invalid Mpesa Paybill number. It must be 6 to 10 digits.' });
        }
        const paymentMethod = await PaymentMethod.create({ restaurant_id, method, mpesa_paybill });
        res.status(201).json({ message: 'Payment method added successfully', paymentMethod });
    } catch (error) {
        console.error('Error creating payment method:', error);
        res.status(500).json({ message: 'Error creating payment method', error: error.message });
    }
};

// Delete a payment method by ID
exports.deletePaymentMethod = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const paymentMethod = await PaymentMethod.findByPk(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        await paymentMethod.destroy();
        res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        res.status(500).json({ message: 'Error deleting payment method', error: error.message });
    }
};
// Update a payment method by ID
// Update a payment method by ID
exports.updatePaymentMethod = async (req, res) => {
    const { id } = req.params;
    const { method } = req.body;

    try {
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        // Update the method
        paymentMethod.method = method;
        await paymentMethod.save();

        res.status(200).json({ message: 'Payment method updated successfully', paymentMethod });
    } catch (error) {
        console.error('Error updating payment method:', error);
        res.status(500).json({ message: 'Error updating payment method', error: error.message });
    }
};
