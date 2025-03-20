const validateMenuItem = (menuItem) => {
    const errors = {};

    if (!menuItem.business_id || typeof menuItem.business_id !== "string" || menuItem.business_id.length > 10) {
        errors.business_id = "Valid business ID (max 10 characters) is required.";
    }

    if (!menuItem.item_name || typeof menuItem.item_name !== "string" || menuItem.item_name.length > 255) {
        errors.item_name = "Item name is required and must be within 255 characters.";
    }

    if (!menuItem.price || isNaN(menuItem.price) || parseFloat(menuItem.price) <= 0) {
        errors.price = "Valid price is required (greater than 0).";
    }

    if (menuItem.image && typeof menuItem.image !== "string") {
        errors.image = "Image URL must be a valid string.";
    }

    if (menuItem.available_stock !== undefined && (!Number.isInteger(menuItem.available_stock) || menuItem.available_stock < 0)) {
        errors.available_stock = "Available stock must be a non-negative integer.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateMenuItem;
