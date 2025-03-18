const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'BusinessOwners', // Reference to the BusinessOwners table
            key: 'id'
        }
    },
    deliveryRange: {
        type: DataTypes.INTEGER, // in kilometers
        allowNull: true
    },
    cuisineType: {
        type: DataTypes.STRING,
        allowNull: true, // e.g., "Italian", "Kenyan", "Fast Food"
    },
    openingHours: {
        type: DataTypes.STRING, // e.g., "10:00 AM - 10:00 PM"
        allowNull: true
    },
    closingHours: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Model options
    indexes: [
        { fields: ['ownerId'] } // Index for efficient lookups
    ]
});

module.exports = Restaurant;