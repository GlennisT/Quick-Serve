const jwt = require('jsonwebtoken');
const customer = require('../models/customer'); // Adjust the path if necessary
const BusinessOwner = require('../models/businessOwner'); // Adjust the path if necessary

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        // Determine user type and fetch user data
        if (decodedToken.customerId) {
            const user = await customer.findByPk(decodedToken.customerId); // Assuming you are using sequelize
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed: User not found.' });
            }
            req.user = user;
        } else if (decodedToken.ownerId) {
            const owner = await BusinessOwner.findByPk(decodedToken.ownerId); // Assuming you are using sequelize
            if (!owner) {
                return res.status(401).json({ message: 'Authentication failed: Owner not found.' });
            }
            req.user = owner;
        } else {
            return res.status(401).json({ message: 'Authentication failed: Invalid token payload.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
    }
};

module.exports = authMiddleware;