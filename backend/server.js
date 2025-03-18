const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const Customer = require('./models/customer'); // Import Customer model
const BusinessOwner = require('./models/businessOwner'); // Import BusinessOwner model
const sequelize = require('./config/database'); // Import sequelize object

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: 'FAG',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Customer Login Route
app.post('/customer-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const customer = await Customer.findOne({ where: { email } });

        if (customer) {
            const passwordMatch = await bcrypt.compare(password, customer.password);

            if (passwordMatch) {
                req.session.userId = customer.id;
                req.session.userType = 'customer';
                return res.redirect('/customer-dashboard.html');
            }
        }
        res.status(401).send('Invalid credentials');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Business Owner Login Route
app.post('/businessowner-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const businessOwner = await BusinessOwner.findOne({ where: { email } });

        if (businessOwner) {
            const passwordMatch = await bcrypt.compare(password, businessOwner.password);

            if (passwordMatch) {
                req.session.userId = businessOwner.id;
                req.session.userType = 'business';
                return res.redirect('/business-dashboard.html');
            }
        }
        res.status(401).send('Invalid credentials');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

// Sync the database
sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
});