// orderController.js
const db = require('../config/db');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { customer_id, restaurant_id, total_price, payment_method } = req.body;
        const query = `INSERT INTO orders (customer_id, restaurant_id, total_price, payment_method, order_status, payment_status) 
                        VALUES (?, ?, ?, ?, 'Pending', 'Pending')`;
        const values = [customer_id, restaurant_id, total_price, payment_method];

        const [result] = await db.query(query, values);
        res.status(201).json({ message: 'Order created successfully', order_id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { order_id } = req.params;
        const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ?', [order_id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all orders for a specific customer
exports.getOrdersByCustomer = async (req, res) => {
    try {
        const { customer_id } = req.params;
        const [orders] = await db.query('SELECT * FROM orders WHERE customer_id = ?', [customer_id]);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { order_status } = req.body;

        const [result] = await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, order_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { payment_status, transaction_id } = req.body;

        const [result] = await db.query('UPDATE orders SET payment_status = ?, transaction_id = ? WHERE order_id = ?', [payment_status, transaction_id, order_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Payment status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params;

        const [result] = await db.query('DELETE FROM orders WHERE order_id = ?', [order_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
