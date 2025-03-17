const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const menuRoutes = require('./routes/menu');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(bodyParser.json());

// Use the routes
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);

// Sync the database
sequelize.sync().then(() => {
  console.log('Database synchronized');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
