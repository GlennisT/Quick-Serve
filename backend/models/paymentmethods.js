// models/paymentmethods.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false, // Disable timestamps as 'created_at' is manually defined
    tableName: 'payment_methods',
});

module.exports = PaymentMethod;