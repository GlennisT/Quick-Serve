const express = require('express');
const { body, param } = require('express-validator');
const {
    createNotification,
    getNotificationsByOwner,
    markNotificationAsRead,
    deleteNotification
} = require('../controllers/notificationsController');

const router = express.Router();

// Create a new notification
router.post('/',
    [
        body('business_owner_id').isInt().withMessage('Business owner ID must be an integer'),
        body('message').isString().withMessage('Message must be a text string')
    ],
    createNotification
);

// Get all notifications for a business owner
router.get('/:business_owner_id',
    param('business_owner_id').isInt().withMessage('Business owner ID must be an integer'),
    getNotificationsByOwner
);

// Mark a notification as read
router.patch('/:id',
    [
        param('id').isInt().withMessage('Notification ID must be an integer'),
        body('is_read').isBoolean().withMessage('is_read must be a boolean value')
    ],
    markNotificationAsRead
);

// Delete a notification
router.delete('/:id',
    param('id').isInt().withMessage('Notification ID must be an integer'),
    deleteNotification
);

module.exports = router;
