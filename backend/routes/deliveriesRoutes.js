// routes/deliveriesRoutes.js
const express = require('express');
const {
    createDelivery, getAllDeliveries, getDeliveryById, updateDeliveryStatus, deleteDelivery
} = require('../controllers/deliveriesController');

const router = express.Router();

router.post('/', createDelivery);
router.get('/', getAllDeliveries);
router.get('/:id', getDeliveryById);
router.patch('/:id/status', updateDeliveryStatus);
router.delete('/:id', deleteDelivery);

module.exports = router;
