const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100], // Ensures name is between 2-100 characters
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // 10 digits total, 2 decimal places
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01 // Prevents zero or negative pricing
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true // Ensures valid URL format
        }
    },
    category: {
        type: DataTypes.ENUM('Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Other'),
        allowNull: false,
        defaultValue: 'Other'
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
    },
    deletedAt: {
        type: DataTypes.DATE // Enables soft delete feature
    }
}, {
    indexes: [
        { fields: ['restaurantId', 'category'] } // Index for efficient lookups
    ],
    paranoid: true // Enables soft delete (records are hidden instead of permanently deleted)
});

module.exports = MenuItem;
