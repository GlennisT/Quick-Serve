const validateCustomer = (customer) => {
    const errors = {};

    if (!customer.first_name || typeof customer.first_name !== "string" || customer.first_name.trim().length === 0) {
        errors.first_name = "First name is required and must be a valid string.";
    }

    if (!customer.last_name || typeof customer.last_name !== "string" || customer.last_name.trim().length === 0) {
        errors.last_name = "Last name is required and must be a valid string.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email || !emailRegex.test(customer.email)) {
        errors.email = "A valid email address is required.";
    }

    if (!customer.password || customer.password.length < 6) {
        errors.password = "Password is required and must be at least 6 characters long.";
    }

    // Optional fields validation
    if (customer.street && typeof customer.street !== "string") {
        errors.street = "Street must be a valid string.";
    }

    if (customer.building && typeof customer.building !== "string") {
        errors.building = "Building name must be a valid string.";
    }

    if (customer.house_number && typeof customer.house_number !== "string") {
        errors.house_number = "House number must be a valid string.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateCustomer;
