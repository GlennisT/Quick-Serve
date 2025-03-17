const { body } = require('express-validator');

// Registration validation
const validateRegistration = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .custom(async (value) => {
      // Check if the username already exists in the database (if applicable)
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username already taken');
      }
      return true;
    }),

  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (value) => {
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+/).withMessage('Password must contain at least one special character'),
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

module.exports = { validateRegistration, validateLogin };
