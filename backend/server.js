require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const Customer = require('./models/customer'); 
const BusinessOwner = require('./models/businessOwner');
const sequelize = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Secure Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecretKey', // Use .env variable
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        httpOnly: true, // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000 // 1 day expiration
    }
}));

// Customer Login Route
app.post('/customer-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ where: { email } });

        if (customer && await bcrypt.compare(password, customer.password)) {
            req.session.userId = customer.id;
            req.session.userType = 'customer';
            return res.json({ message: 'Login successful', userType: 'customer' });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Customer login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Business Owner Login Route
app.post('/businessowner-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const businessOwner = await BusinessOwner.findOne({ where: { email } });

        if (businessOwner && await bcrypt.compare(password, businessOwner.password)) {
            req.session.userId = businessOwner.id;
            req.session.userType = 'business';
            return res.json({ message: 'Login successful', userType: 'business' });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Business owner login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Sync Database & Start Server
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('❌ Database sync error:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});
