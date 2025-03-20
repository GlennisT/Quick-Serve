const Notification = require('../models/notifications');
const { validationResult } = require('express-validator');

// Get All Notifications for a Business Owner
exports.getNotificationsByOwner = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const business_owner_id = parseInt(req.params.business_owner_id);
        const notifications = await Notification.findAll({
            where: { business_owner_id },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
    }
};

// Get a Single Notification by ID
exports.getNotificationById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ success: false, message: 'Error fetching notification', error: error.message });
    }
};

// Create a New Notification
exports.createNotification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { business_owner_id, message } = req.body;

        const notification = await Notification.create({
            business_owner_id,
            message,
            is_read: false
        });

        res.status(201).json({ success: true, message: 'Notification created successfully', data: notification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, message: 'Error creating notification', error: error.message });
    }
};

// Mark a Notification as Read
exports.markNotificationAsRead = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        notification.is_read = true;
        await notification.save();

        res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ success: false, message: 'Error updating notification status', error: error.message });
    }
};

// Delete a Notification
exports.deleteNotification = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await notification.destroy();
        res.status(204).send(); // No content response
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, message: 'Error deleting notification', error: error.message });
    }
};
