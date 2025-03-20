const validateAddress = (address) => {
    const errors = {};

    if (!address.customer_id || isNaN(address.customer_id)) {
        errors.customer_id = "Customer ID is required and must be a number.";
    }

    if (!address.first_name || address.first_name.trim().length === 0) {
        errors.first_name = "First name is required.";
    } else if (address.first_name.length > 100) {
        errors.first_name = "First name must not exceed 100 characters.";
    }

    if (!address.building_name || address.building_name.trim().length === 0) {
        errors.building_name = "Building name is required.";
    } else if (address.building_name.length > 255) {
        errors.building_name = "Building name must not exceed 255 characters.";
    }

    if (!address.house_number || address.house_number.trim().length === 0) {
        errors.house_number = "House number is required.";
    } else if (address.house_number.length > 50) {
        errors.house_number = "House number must not exceed 50 characters.";
    }

    if (!address.street || address.street.trim().length === 0) {
        errors.street = "Street is required.";
    } else if (address.street.length > 255) {
        errors.street = "Street must not exceed 255 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateAddress;
