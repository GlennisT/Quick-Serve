const { Sequelize } = require('sequelize');

// Set up your MySQL connection using Sequelize
const sequelize = new Sequelize('quick_serve_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
