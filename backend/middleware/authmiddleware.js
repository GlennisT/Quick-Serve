const authMiddleware = (req, res, next) => {
    console.log("Authentication temporarily disabled.");
    next();  // Just move to the next middleware without checking JWT
};

module.exports = authMiddleware;
