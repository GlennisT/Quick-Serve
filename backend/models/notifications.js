const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recipientType: {
        type: DataTypes.ENUM('Customer', 'BusinessOwner'), // Determines if the notification is for a customer or a business
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Order Update', 'New Order', 'Promotion', 'General'),
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Marks whether the notification has been read
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = Notification;
