const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    business_id: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    item_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    available_stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
        validate: {
            min: 0
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'menu_items',
    timestamps: false, // Disables auto `updatedAt` & `createdAt` fields
});

module.exports = MenuItem;
