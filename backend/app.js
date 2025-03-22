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
app.use(corsMiddleware);
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

// Authentication Middleware (Apply if needed)
app.use(authMiddleware);

// Error Handling Middleware
app.use(errorMiddleware);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
    console.log("Received GET request at /");
    res.send("Server is working!");
  });


module.exports = app;
