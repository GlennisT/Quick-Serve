const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const BusinessOwner = sequelize.define('BusinessOwner', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    business_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    business_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    mpesaNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [6, 10]  // Ensures Paybill/Till number is between 6 and 10 digits
        }
    }
    
}, {
    timestamps: false,
    tableName: 'business_owners',
    freezeTableName: true,
});

// Hash password before saving
BusinessOwner.beforeCreate(async (owner) => {
    owner.password = await bcrypt.hash(owner.password, 10);
});

// Hash password before updating (if changed)
BusinessOwner.beforeUpdate(async (owner) => {
    if (owner.changed('password')) {
        owner.password = await bcrypt.hash(owner.password, 10);
    }
});

// Compare passwords
BusinessOwner.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = BusinessOwner;
