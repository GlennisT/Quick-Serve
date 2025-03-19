const Notification = require('../models/notification');
const { validationResult, body, param } = require('express-validator');

// Get All Notifications for a Business Owner
exports.getNotificationsByOwner = [
    param('business_owner_id').isInt().withMessage('Business Owner ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { business_owner_id } = req.params;
            const notifications = await Notification.findAll({
                where: { business_owner_id },
                order: [['created_at', 'DESC']]
            });

            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ message: 'Error fetching notifications', error: error.message });
        }
    }
];

// Get a Single Notification by ID
exports.getNotificationById = [
    param('id').isInt().withMessage('Notification ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.status(200).json(notification);
        } catch (error) {
            console.error('Error fetching notification:', error);
            res.status(500).json({ message: 'Error fetching notification', error: error.message });
        }
    }
];

// Create a New Notification
exports.createNotification = [
    body('business_owner_id').isInt().withMessage('Business Owner ID must be an integer'),
    body('message').isString().notEmpty().withMessage('Message is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { business_owner_id, message } = req.body;

            const notification = await Notification.create({
                business_owner_id,
                message,
                is_read: 0
            });

            res.status(201).json({ message: 'Notification created successfully', notification });
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ message: 'Error creating notification', error: error.message });
        }
    }
];

// Mark a Notification as Read
exports.markAsRead = [
    param('id').isInt().withMessage('Notification ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            notification.is_read = 1;
            await notification.save();

            res.status(200).json({ message: 'Notification marked as read', notification });
        } catch (error) {
            console.error('Error updating notification status:', error);
            res.status(500).json({ message: 'Error updating notification status', error: error.message });
        }
    }
];

// Delete a Notification
exports.deleteNotification = [
    param('id').isInt().withMessage('Notification ID must be an integer'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const notification = await Notification.findByPk(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }

            await notification.destroy();
            res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({ message: 'Error deleting notification', error: error.message });
        }
    }
];
