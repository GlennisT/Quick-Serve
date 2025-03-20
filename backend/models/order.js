const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants',
            key: 'id'
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    payment_method: {
        type: DataTypes.ENUM('Cash', 'M-Pesa'),
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
        allowNull: true,
        defaultValue: 'Pending'
    },
    order_status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Completed', 'Cancelled'),
        allowNull: true,
        defaultValue: 'Pending'
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false // Since `created_at` is handled manually
});

module.exports = Order;
