const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers', // Reference to the Customers table
            key: 'id'
        }
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants', // Reference to the Restaurants table
            key: 'id'
        }
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01 // Prevents zero or negative total amounts
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
    },
    paymentMethod: {
        type: DataTypes.ENUM('cash', 'credit_card', 'mpesa'),
        allowNull: false,
        defaultValue: 'mpesa'
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE // Enables soft delete feature
    }
}, {
    indexes: [
        { fields: ['customerId', 'status'] },
        { fields: ['restaurantId', 'status'] }
    ],
    paranoid: true // Enables soft delete (records are hidden instead of permanently deleted)
});

module.exports = Order;
