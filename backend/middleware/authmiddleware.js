const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // 1. Get the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // 2. Check if the token exists
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided' });
        }

        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user details to the request
        if (decoded.customerId) {
            req.user = { id: decoded.customerId, role: 'customer' };
        } else if (decoded.businessOwnerId) {
            req.user = { id: decoded.businessOwnerId, role: 'business' };
        } else {
            return res.status(401).json({ message: 'Authentication failed: Invalid token' });
        }

        // 5. Call the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        // Handle different JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication failed: Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Authentication failed: Invalid token' });
        }

        return res.status(500).json({ message: 'Authentication failed: Internal server error' });
    }
};

module.exports = authMiddleware;
