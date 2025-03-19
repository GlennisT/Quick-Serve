const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers', // Reference to the Customers table
            key: 'id'
        }
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
        { fields: ['customerId', 'restaurantId'] }, // Index for efficient lookups
        { fields: ['restaurantId', 'rating'] }
    ]
});

module.exports = Review;
