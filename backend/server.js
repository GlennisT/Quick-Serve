const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session Configuration
app.use(session({
    secret: 'your_secret_key', // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production if using HTTPS
}));

// Database Connection (Placeholder)
const db = mysql.createConnection({
    host: 'your_db_host', // Replace
    user: 'your_db_user', // Replace
    password: 'your_db_password', // Replace
    database: 'your_db_name' // Replace
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to database');
});

// Customer Login Route
app.post('/customer-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Placeholder database query (Replace)
        db.query('SELECT * FROM Customers WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password); // Replace user.password

                if (passwordMatch) {
                    req.session.userId = user.id; // Replace user.id
                    req.session.userType = 'customer';
                    return res.redirect('/customer-dashboard.html');
                }
            }
            res.status(401).send('Invalid credentials');
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Business Owner Login Route
app.post('/business-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Placeholder database query (Replace)
        db.query('SELECT * FROM BusinessOwners WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Internal Server Error');
            }

            if (results.length > 0) {
                const user = results[0];
                const passwordMatch = await bcrypt.compare(password, user.password); // Replace user.password

                if (passwordMatch) {
                    req.session.userId = user.id; // Replace user.id
                    req.session.userType = 'business';
                    return res.redirect('/business-dashboard.html');
                }
            }
            res.status(401).send('Invalid credentials');
        });
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
        res.redirect('/'); // Redirect to homepage or login page
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});