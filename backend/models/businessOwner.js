const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BusinessOwner = sequelize.define('BusinessOwner', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
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
    businessName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isNumeric: true
        }
    }
}, {
    // Model options
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['nationalId'] }
    ]
});

module.exports = BusinessOwner;