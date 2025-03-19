const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables early

const cors = require('cors'); // Security and cross-origin requests
const helmet = require('helmet'); // Adds security headers
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
const sequelize = require('./config/database'); // Import database connection

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors()); // Use corsMiddleware if you have custom rules
app.use(loggingMiddleware);
app.use(express.json());

// Database Connection
sequelize
    .authenticate()
    .then(() => {
        console.log('✅ Database connected successfully.');
        // sequelize.sync({ force: true }); // Uncomment for dev mode (drops and recreates tables)
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit process if DB connection fails
    });

// Use Routes
app.use('/api/customers', customerRoutes);
app.use('/api/business-owners', businessOwnerRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/uploads/menu-items', express.static('uploads/menu-items'));


// Error Handling Middleware (must be last)
app.use(errorMiddleware);

// Start the Server
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});

// Graceful Shutdown for unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});
