const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order'); // Assuming an Order model exists

const Delivery = sequelize.define('Delivery', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Out for Delivery', 'Delivered', 'Failed'),
        defaultValue: 'Pending',
        allowNull: false
    },
    estimatedDeliveryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actualDeliveryTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT, // Optional notes for the delivery
        allowNull: true
    }
}, {
    indexes: [
        { fields: ['orderId'] },
        { fields: ['status'] }
    ]
});

// Associate Delivery with Order
Delivery.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = Delivery;
