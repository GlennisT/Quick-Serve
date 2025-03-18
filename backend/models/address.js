const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    county: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subCounty: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: true // Postal codes might not exist in all areas in Kenya
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8), // Example precision and scale
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8), // Example precision and scale
        allowNull: true
    },
    addressType: {
        type: DataTypes.ENUM('customer', 'business'), // Indicates if it's a customer or business address
        allowNull: false
    },
    addressableId: { // Foreign key to either Customer or BusinessOwner
        type: DataTypes.INTEGER,
        allowNull: false
    },
    addressableType: { // To allow for polymorphic relationship
        type: DataTypes.ENUM('Customer', 'BusinessOwner'),
        allowNull: false
    }
}, {
    // Model options
    indexes: [
        { fields: ['addressableId', 'addressableType'] } // Index for efficient lookups
    ]
});

module.exports = Address;