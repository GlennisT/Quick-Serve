const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verify environment variables
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    console.error('Missing database environment variables.');
    process.exit(1); // Exit if variables are missing
}

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+00:00', // Or your desired timezone
        logging: console.log, // Or false in production
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // For SSL/TLS in production:
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false
        //     }
        // }
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected!');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;