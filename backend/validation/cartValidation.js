const validateCart = (cartItem) => {
    const errors = {};

    if (!cartItem.customer_id || isNaN(cartItem.customer_id)) {
        errors.customer_id = "Valid customer ID is required.";
    }

    if (!cartItem.restaurant_id || isNaN(cartItem.restaurant_id)) {
        errors.restaurant_id = "Valid restaurant ID is required.";
    }

    if (!cartItem.menu_item_id || isNaN(cartItem.menu_item_id)) {
        errors.menu_item_id = "Valid menu item ID is required.";
    }

    if (!cartItem.quantity || isNaN(cartItem.quantity) || cartItem.quantity < 1) {
        errors.quantity = "Quantity must be a number and at least 1.";
    }

    if (!cartItem.total_price || isNaN(cartItem.total_price) || cartItem.total_price < 0) {
        errors.total_price = "Total price must be a valid number and not negative.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateCart;
