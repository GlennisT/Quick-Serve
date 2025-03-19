const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validate environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1); // Exit if any variables are missing
}

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME, // Changed to match the environment variable check
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        timezone: '+00:00', // Change based on your preferred timezone
        logging: process.env.NODE_ENV === 'production' ? false : console.log, // Disable logging in production
        pool: {
            max: 10, // Increased for better scalability
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // Uncomment for SSL/TLS in production if required
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false
        //     }
        // }
    }
);

// Test database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
})();

module.exports = sequelize;
