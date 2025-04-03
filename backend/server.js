const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const corsMiddleware = require("./middleware/corsMiddleware");
const PORT = 5000;


// Import Routes
const addressRoutes = require('./routes/addressRoutes'); // Ensure correct path
const businessOwnerRoutes = require("./routes/businessOwnerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const customerRoutes = require("./routes/customerRoutes");
const deliveriesRoutes = require("./routes/deliveriesRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentMethodsRoutes = require("./routes/paymentmethodsRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
  });
// Routes
app.use('/api/addresses', addressRoutes);
app.use("/api/business", businessOwnerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-methods", paymentMethodsRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);

app.get('api/addresses', (req, res) => {
  res.json({ message: 'Addresses endpoint works!' });
});


// Authentication Middleware (Apply to secured routes only)
app.use("/api", authMiddleware);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  app.get("/", (req, res) => {
      console.log("Received GET request at /");
      res.send("Server is working!");
    });


module.exports = app;
