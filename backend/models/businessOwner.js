const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

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
            is: /^[0-9]{10}$/, // Ensures exactly 10 digits
            msg: 'Phone number must be 10 digits long'
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
BusinessOwner.beforeCreate(async (businessOwner) => {
    businessOwner.password = await bcrypt.hash(businessOwner.password, 10);
});

// Method to compare passwords (for login authentication)
BusinessOwner.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = BusinessOwner;
