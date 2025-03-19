const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

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
            is: /^[0-9]{10}$/, // Ensures exactly 10 digits
            msg: 'Phone number must be 10 digits long'
        }
    },
    nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isNumeric: true
        }
    },
    deletedAt: {
        type: DataTypes.DATE // Enables soft delete feature
    }
}, {
    indexes: [
        { unique: true, fields: ['email'] },
        { unique: true, fields: ['nationalId'] }
    ],
    paranoid: true // Enables soft delete (does not permanently delete records)
});

// Hash password before saving
Customer.beforeCreate(async (customer) => {
    customer.password = await bcrypt.hash(customer.password, 10);
});

// Method to compare passwords (for login authentication)
Customer.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
Customer.hasMany(require('./address'), { 
    foreignKey: 'addressableId',
    constraints: false,
    scope: { addressableType: 'Customer' }
});

module.exports = Customer;
