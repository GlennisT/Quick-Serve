const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures restaurant names are unique
        validate: {
            len: [2, 100] // Prevents very short or excessively long names
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true // Ensures it's a valid URL if provided
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
            len: [10, 15] // Ensures a reasonable phone number length
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
        allowNull: true,
        validate: {
            min: 1, // Ensures a minimum delivery range of 1km
            max: 50 // Prevents unrealistic delivery distances
        }
    },
    cuisineType: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [3, 50] // Ensures valid cuisine type names
        }
    },
    openingHours: {
        type: DataTypes.TIME, // Stores only time
        allowNull: false
    },
    closingHours: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'closed', 'temporarily_closed'),
        allowNull: false,
        defaultValue: 'open' // Helps track if a restaurant is accepting orders
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE // Enables soft delete feature
    }
}, {
    indexes: [
        { unique: true, fields: ['name'] },
        { fields: ['ownerId'] },
        { fields: ['cuisineType'] }
    ],
    paranoid: true // Enables soft delete (records are hidden instead of permanently deleted)
});

module.exports = Restaurant;
