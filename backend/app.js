const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/corsMiddleware');
const loggingMiddleware = require('./middleware/loggingMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const customerRoutes = require('./routes/customerRoutes');
const businessOwnerRoutes = require('./routes/businessOwnerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const addressRoutes = require('./routes/addressRoutes');
const sequelize = require('./config/database'); // Import your database connection

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Apply Middleware
app.use(corsMiddleware);
app.use(loggingMiddleware);
app.use(express.json());

// Database Connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        // sequelize.sync({ force: true }); // Use this to drop and recreate tables (development only)
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Use Routes
app.use('/api/customers', customerRoutes);
app.use('/api/business-owners', businessOwnerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);

// Error Handling Middleware (must be last)
app.use(errorMiddleware);

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});