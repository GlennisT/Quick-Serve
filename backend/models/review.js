const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Customers',
            key: 'id'
        }
    },
    restaurant_id: { // Updated to match database schema
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Restaurants',
            key: 'id'
        }
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review_text: { // Renamed from 'comment' to match database column
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING, // Stores image filename
        allowNull: true
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = Review;
