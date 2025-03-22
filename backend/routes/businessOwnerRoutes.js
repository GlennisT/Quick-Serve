const express = require('express');
const { body, param } = require('express-validator');
const {
    registerBusinessOwner,
    getBusinessOwners,
    getBusinessOwnerById,
    updateBusinessOwner,
    deleteBusinessOwner
} = require('../controllers/businessOwnerController');

const router = express.Router();

router.post('/register',
    [
        body('first_name').notEmpty().withMessage('First name is required'),
        body('last_name').notEmpty().withMessage('Last name is required'),
        body('business_name').notEmpty().withMessage('Business name is required'),
        body('business_location').notEmpty().withMessage('Business location is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('business_id').notEmpty().withMessage('Business ID is required')
    ],
    registerBusinessOwner
);

router.get('/', getBusinessOwners);
router.get('/:id', param('id').isInt().withMessage('ID must be an integer'), getBusinessOwnerById);
router.put('/:id', param('id').isInt(), updateBusinessOwner);
router.delete('/:id', param('id').isInt(), deleteBusinessOwner);

module.exports = router;
