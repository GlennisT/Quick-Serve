const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // 1. Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2. Check if the token exists
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Check if the token contains customerId or businessOwnerId
        if (decoded.customerId) {
            req.customerId = decoded.customerId;
            req.role = 'customer'; // Add role to request
        } else if (decoded.businessOwnerId) {
            req.businessOwnerId = decoded.businessOwnerId;
            req.role = 'business'; // Add role to request
        } else {
            return res.status(401).json({ message: 'Authentication failed: Invalid token' });
        }

        // 5. Call the next middleware or route handler
        next();
    } catch (error) {
        // 6. Handle token verification errors
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
};

module.exports = authMiddleware;