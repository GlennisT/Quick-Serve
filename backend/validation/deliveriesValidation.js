const validateDelivery = (delivery) => {
    const errors = {};

    if (!delivery.order_id || isNaN(delivery.order_id) || delivery.order_id <= 0) {
        errors.order_id = "Valid order ID is required.";
    }

    const validStatuses = ["Pending", "Out for Delivery", "Delivered", "Failed"];
    if (!delivery.delivery_status || !validStatuses.includes(delivery.delivery_status)) {
        errors.delivery_status = "Delivery status must be one of: Pending, Out for Delivery, Delivered, Failed.";
    }

    if (delivery.estimated_time && !/^\d{2}:\d{2}:\d{2}$/.test(delivery.estimated_time)) {
        errors.estimated_time = "Estimated time must be in HH:MM:SS format.";
    }

    if (delivery.delivery_person && typeof delivery.delivery_person !== "string") {
        errors.delivery_person = "Delivery person's name must be a valid string.";
    }

    if (delivery.contact_number && !/^\d{7,20}$/.test(delivery.contact_number)) {
        errors.contact_number = "Contact number must be a valid numeric string (7-20 digits).";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateDelivery;
