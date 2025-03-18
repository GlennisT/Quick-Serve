const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 decimal places
        allowNull: false
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders', // Reference to the Orders table
            key: 'id'
        }
    },
    menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MenuItems', // Reference to the MenuItems table
            key: 'id'
        }
    }
}, {
    // Model options
    indexes: [
        { fields: ['orderId', 'menuItemId'] } // Index for efficient lookups
    ]
});

module.exports = OrderItem;