const Joi = require("joi");

// Define a regex pattern for time format (hh:mm AM/PM)
const timePattern = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

// Define the validation schema
const restaurantSchema = Joi.object({
    business_owner_id: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Business owner ID must be a number.",
            "number.integer": "Business owner ID must be an integer.",
            "number.min": "Business owner ID must be a positive number.",
            "any.required": "Business owner ID is required."
        }),

    name: Joi.string().trim().max(255).required()
        .messages({
            "string.base": "Restaurant name must be a string.",
            "string.empty": "Restaurant name cannot be empty.",
            "string.max": "Restaurant name must not exceed 255 characters.",
            "any.required": "Restaurant name is required."
        }),

    location: Joi.string().trim().max(255).required()
        .messages({
            "string.base": "Location must be a string.",
            "string.empty": "Location cannot be empty.",
            "string.max": "Location must not exceed 255 characters.",
            "any.required": "Location is required."
        }),

    logo: Joi.string().uri().optional()
        .messages({
            "string.uri": "Logo must be a valid URL."
        }),

    openingHours: Joi.string().pattern(timePattern).required()
        .messages({
            "string.pattern.base": "Opening hours must be in the format hh:mm AM/PM.",
            "any.required": "Opening hours are required."
        }),

    closingHours: Joi.string().pattern(timePattern).required()
        .messages({
            "string.pattern.base": "Closing hours must be in the format hh:mm AM/PM.",
            "any.required": "Closing hours are required."
        })
});

// Function to validate restaurant data
const validateRestaurant = (data) => {
    const { error } = restaurantSchema.validate(data, { abortEarly: false });
    if (error) return { error };

    // Ensure closing time is later than opening time
    const openingTime = convertTo24HourFormat(data.openingHours);
    const closingTime = convertTo24HourFormat(data.closingHours);
    
    if (closingTime <= openingTime) {
        return { error: { details: [{ message: "Closing hours must be later than opening hours." }] } };
    }

    return { error: null };
};

// Helper function to convert 12-hour format to 24-hour for comparison
const convertTo24HourFormat = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes; // Convert to minutes for easy comparison
};

module.exports = validateRestaurant;
