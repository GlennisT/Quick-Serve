const PaymentMethod = require('../models/paymentMethod');
const { validationResult, body, param } = require('express-validator');

// Get All Payment Methods for a Specific Restaurant
exports.getPaymentMethodsByRestaurant = [
    param('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { restaurant_id } = req.params;
            const paymentMethods = await PaymentMethod.findAll({
                where: { restaurant_id },
                order: [['created_at', 'DESC']]
            });

            res.status(200).json(paymentMethods);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
        }
    }
];

// Get a Single Payment Method by ID
exports.getPaymentMethodById = [
    param('id').isInt().withMessage('Payment Method ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const paymentMethod = await PaymentMethod.findByPk(req.params.id);
            if (!paymentMethod) {
                return res.status(404).json({ message: 'Payment method not found' });
            }
            res.status(200).json(paymentMethod);
        } catch (error) {
            console.error('Error fetching payment method:', error);
            res.status(500).json({ message: 'Error fetching payment method', error: error.message });
        }
    }
];

// Create a New Payment Method
exports.createPaymentMethod = [
    body('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    body('method').isString().notEmpty().withMessage('Payment method is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { restaurant_id, method } = req.body;

            const paymentMethod = await PaymentMethod.create({
                restaurant_id,
                method
            });

            res.status(201).json({ message: 'Payment method added successfully', paymentMethod });
        } catch (error) {
            console.error('Error creating payment method:', error);
            res.status(500).json({ message: 'Error creating payment method', error: error.message });
        }
    }
];

// Update a Payment Method
exports.updatePaymentMethod = [
    param('id').isInt().withMessage('Payment Method ID must be an integer'),
    body('method').isString().notEmpty().withMessage('Payment method is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const paymentMethod = await PaymentMethod.findByPk(req.params.id);
            if (!paymentMethod) {
                return res.status(404).json({ message: 'Payment method not found' });
            }

            paymentMethod.method = req.body.method;
            await paymentMethod.save();

            res.status(200).json({ message: 'Payment method updated successfully', paymentMethod });
        } catch (error) {
            console.error('Error updating payment method:', error);
            res.status(500).json({ message: 'Error updating payment method', error: error.message });
        }
    }
];

// Delete a Payment Method
exports.deletePaymentMethod = [
    param('id').isInt().withMessage('Payment Method ID must be an integer'),
    async (req, res) => {
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
    }
];
