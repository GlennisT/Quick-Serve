const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Customer = sequelize.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    building: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    house_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    phone_number: { // Added phone_number
        type: DataTypes.STRING(20), // Adjust length as needed
        allowNull: true, // Or false if you want it required
    }
}, {
    timestamps: false,
    tableName: 'customers', // Prevents Sequelize from adding updatedAt & createdAt fields
});

// Hash password before saving
Customer.beforeCreate(async (customer) => {
    customer.password = await bcrypt.hash(customer.password, 10);
});

// Compare hashed passwords for login
Customer.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Customer;