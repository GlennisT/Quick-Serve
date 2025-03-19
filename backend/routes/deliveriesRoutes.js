const express = require('express');
const { body, param } = require('express-validator');
const {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDeliveryStatus,
    deleteDelivery
} = require('../controllers/deliveryController');

const router = express.Router();

// Create a new delivery
router.post('/',
    [
        body('order_id').isInt().withMessage('Order ID must be an integer'),
        body('estimated_time').optional().matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Invalid time format (HH:MM:SS)'),
        body('delivery_person').optional().isString().withMessage('Delivery person must be a string'),
        body('contact_number').optional().isString().withMessage('Contact number must be a valid string')
    ],
    createDelivery
);

// Get all deliveries
router.get('/', getAllDeliveries);

// Get a specific delivery by ID
router.get('/:id',
    param('id').isInt().withMessage('Delivery ID must be an integer'),
    getDeliveryById
);

// Update delivery status
router.patch('/:id/status',
    [
        param('id').isInt().withMessage('Delivery ID must be an integer'),
        body('delivery_status').isIn(['Pending', 'Out for Delivery', 'Delivered', 'Failed']).withMessage('Invalid delivery status')
    ],
    updateDeliveryStatus
);

// Delete a delivery record
router.delete('/:id',
    param('id').isInt().withMessage('Delivery ID must be an integer'),
    deleteDelivery
);

module.exports = router;
