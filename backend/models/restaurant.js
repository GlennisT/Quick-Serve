const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 100]
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
            isUrl: true
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^[\d+\s-]+$/, // Allows numbers, spaces, +, and -
            len: [10, 15]
        }
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'BusinessOwners',
            key: 'id'
        }
    },
    deliveryRange: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 50
        }
    },
    cuisineType: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [3, 50]
        }
    },
    openingHours: {
        type: DataTypes.STRING(10), // Allows flexible time formats
        allowNull: false
    },
    closingHours: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'closed', 'temporarily_closed'),
        allowNull: false,
        defaultValue: 'open'
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    indexes: [
        { unique: true, fields: ['name'] },
        { fields: ['ownerId'] },
        { fields: ['cuisineType'] }
    ],
    paranoid: true
});

module.exports = Restaurant;
