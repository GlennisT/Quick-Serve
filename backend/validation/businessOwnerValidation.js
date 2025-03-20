const validateBusinessOwner = (owner) => {
    const errors = {};

    if (!owner.first_name || owner.first_name.trim().length === 0) {
        errors.first_name = "First name is required.";
    } else if (owner.first_name.length > 255) {
        errors.first_name = "First name must not exceed 255 characters.";
    }

    if (!owner.last_name || owner.last_name.trim().length === 0) {
        errors.last_name = "Last name is required.";
    } else if (owner.last_name.length > 255) {
        errors.last_name = "Last name must not exceed 255 characters.";
    }

    if (!owner.business_name || owner.business_name.trim().length === 0) {
        errors.business_name = "Business name is required.";
    } else if (owner.business_name.length > 255) {
        errors.business_name = "Business name must not exceed 255 characters.";
    }

    if (!owner.business_location || owner.business_location.trim().length === 0) {
        errors.business_location = "Business location is required.";
    } else if (owner.business_location.length > 255) {
        errors.business_location = "Business location must not exceed 255 characters.";
    }

    if (!owner.email || owner.email.trim().length === 0) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)) {
        errors.email = "Invalid email format.";
    }

    if (!owner.password || owner.password.trim().length === 0) {
        errors.password = "Password is required.";
    } else if (owner.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    }

    if (!owner.business_id || owner.business_id.trim().length === 0) {
        errors.business_id = "Business ID is required.";
    } else if (owner.business_id.length > 10) {
        errors.business_id = "Business ID must not exceed 10 characters.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = validateBusinessOwner;
