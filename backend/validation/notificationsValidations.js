const validateNotification = (notification) => {
    const errors = {};

    if (!notification.business_owner_id || !Number.isInteger(notification.business_owner_id) || notification.business_owner_id <= 0) {
        errors.business_owner_id = "Valid business owner ID is required.";
    }

    if (!notification.message || typeof notification.message !== "string" || notification.message.trim() === "") {
        errors.message = "Notification message is required and must be a valid string.";
    }

    if (notification.is_read !== undefined && typeof notification.is_read !== "boolean") {
        errors.is_read = "is_read must be a boolean (true or false).";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateNotification;
