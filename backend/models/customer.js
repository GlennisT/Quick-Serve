const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
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

module.exports = Customer;