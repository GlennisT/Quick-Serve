const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
    name: {
        type: DataTypes.ENUM('cash', 'credit_card', 'mpesa'),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    deletedAt: {
        type: DataTypes.DATE // Enables soft delete feature
    }
}, {
    paranoid: true // Enables soft delete
});

module.exports = PaymentMethod;
