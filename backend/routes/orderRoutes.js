const express = require('express');
const {
    createOrder,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:order_id', getOrderById);
router.get('/customer/:customer_id', getOrdersByCustomer);
router.patch('/:order_id/status', updateOrderStatus);
router.patch('/:order_id/payment', updatePaymentStatus);
router.delete('/:order_id', deleteOrder);

module.exports = router;