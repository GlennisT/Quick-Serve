const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    business_owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'BusinessOwners',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 100]
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    openingHours: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "08:00 AM"
    },
    closingHours: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "10:00 PM"
    },
    status: {
        type: DataTypes.ENUM('open', 'closed', 'temporarily_closed'),
        allowNull: false,
        defaultValue: 'open'
    },
    deletedAt: {
        type: DataTypes.DATE
    }
}, {
    timestamps: true,
    paranoid: true, // Enables soft delete
    indexes: [
        { unique: true, fields: ['name'] },
        { fields: ['business_owner_id'] }
    ]
});

module.exports = Restaurant;
