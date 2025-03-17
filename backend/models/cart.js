const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const MenuItem = require('./menuItem');  // Reference the MenuItem model

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

Cart.hasMany(CartItem);  // A cart has many items
CartItem.belongsTo(Cart);  // A cart item belongs to a cart

CartItem.belongsTo(MenuItem);  // Each cart item references a menu item
MenuItem.hasMany(CartItem);  // A menu item can appear in many cart items

module.exports = { Cart, CartItem };
