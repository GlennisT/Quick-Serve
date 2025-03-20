const Joi = require("joi");

// Define the validation schema
const paymentMethodSchema = Joi.object({
    restaurant_id: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Restaurant ID must be a number.",
            "number.integer": "Restaurant ID must be an integer.",
            "number.min": "Restaurant ID must be a positive number.",
            "any.required": "Restaurant ID is required."
        }),
    
    method: Joi.string().trim().max(50).required()
        .messages({
            "string.base": "Payment method must be a string.",
            "string.empty": "Payment method cannot be empty.",
            "string.max": "Payment method must not exceed 50 characters.",
            "any.required": "Payment method is required."
        })
});

// Function to validate payment method data
const validatePaymentMethod = (data) => {
    return paymentMethodSchema.validate(data, { abortEarly: false });
};

module.exports = validatePaymentMethod;
