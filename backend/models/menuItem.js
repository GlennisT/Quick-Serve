const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 decimal places
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true // e.g., "Appetizers", "Main Courses", "Desserts"
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants', // Reference to the Restaurants table
            key: 'id'
        }
    }
}, {
    // Model options
    indexes: [
        { fields: ['restaurantId', 'category'] } // Index for efficient lookups
    ]
});

module.exports = MenuItem;