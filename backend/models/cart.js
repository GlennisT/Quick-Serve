// models/cart.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');
const Restaurant = require('./restaurant');
const MenuItem = require('./menuItem');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    menu_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    total_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'cart',
});

// Associations
Cart.belongsTo(Customer, { foreignKey: 'customer_id' });
Cart.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Cart.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

module.exports = Cart;