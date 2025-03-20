const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const corsMiddleware = require("./middleware/corsMiddleware");

// Import Routes
const addressRoutes = require("./routes/addressRoutes");
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

// Routes
app.use("/api/address", addressRoutes);
app.use("/api/business-owner", businessOwnerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment-methods", paymentMethodsRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);

// Authentication Middleware (Apply to secured routes only)
app.use("/api", authMiddleware);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
