const { DataTypes } = require('sequelize');
const sequelize = require('../db');  // Our database connection

const MenuItem = sequelize.define('MenuItem', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,  // URL to the image
  },
});

module.exports = MenuItem;
