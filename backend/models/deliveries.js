// models/delivery.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');

const Delivery = sequelize.define('Deliveries', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    delivery_status: {
        type: DataTypes.ENUM('Pending', 'Out for Delivery', 'Delivered', 'Failed'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    estimated_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    delivery_person: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contact_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'deliveries',
});

Delivery.belongsTo(Order, { foreignKey: 'order_id' });

module.exports = Delivery;
