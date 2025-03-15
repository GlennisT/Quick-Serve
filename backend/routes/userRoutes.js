const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();

// Registration route
// Validate registration inputs before creating the user
router.post('/register', validateRegistration, registerUser);

// Login route
// Validate login inputs before logging the user in
router.post('/login', validateLogin, loginUser);

// Protected route: User profile
// Only authenticated users can access this route
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
