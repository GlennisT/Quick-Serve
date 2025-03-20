const validateOrder = (order) => {
    const errors = {};

    if (!order.customer_id || !Number.isInteger(order.customer_id) || order.customer_id <= 0) {
        errors.customer_id = "Valid customer ID is required.";
    }

    if (!order.restaurant_id || !Number.isInteger(order.restaurant_id) || order.restaurant_id <= 0) {
        errors.restaurant_id = "Valid restaurant ID is required.";
    }

    if (!order.total_price || isNaN(order.total_price) || order.total_price <= 0) {
        errors.total_price = "Total price must be a positive number.";
    }

    const validPaymentMethods = ["Cash", "M-Pesa"];
    if (!order.payment_method || !validPaymentMethods.includes(order.payment_method)) {
        errors.payment_method = "Invalid payment method. Must be 'Cash' or 'M-Pesa'.";
    }

    const validPaymentStatuses = ["Pending", "Paid", "Failed"];
    if (order.payment_status && !validPaymentStatuses.includes(order.payment_status)) {
        errors.payment_status = "Invalid payment status. Must be 'Pending', 'Paid', or 'Failed'.";
    }

    const validOrderStatuses = ["Pending", "Processing", "Completed", "Cancelled"];
    if (order.order_status && !validOrderStatuses.includes(order.order_status)) {
        errors.order_status = "Invalid order status. Must be 'Pending', 'Processing', 'Completed', or 'Cancelled'.";
    }

    if (order.transaction_id && typeof order.transaction_id !== "string") {
        errors.transaction_id = "Transaction ID must be a string.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateOrder;
