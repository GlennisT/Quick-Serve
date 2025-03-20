const Joi = require("joi");

// Define the validation schema
const reviewSchema = Joi.object({
    customer_id: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Customer ID must be a number.",
            "number.integer": "Customer ID must be an integer.",
            "number.min": "Customer ID must be a positive number.",
            "any.required": "Customer ID is required."
        }),

    restaurant_id: Joi.number().integer().min(1).required()
        .messages({
            "number.base": "Restaurant ID must be a number.",
            "number.integer": "Restaurant ID must be an integer.",
            "number.min": "Restaurant ID must be a positive number.",
            "any.required": "Restaurant ID is required."
        }),

    rating: Joi.number().integer().min(1).max(5).required()
        .messages({
            "number.base": "Rating must be a number.",
            "number.integer": "Rating must be an integer.",
            "number.min": "Rating must be at least 1.",
            "number.max": "Rating cannot be more than 5.",
            "any.required": "Rating is required."
        }),

    review_text: Joi.string().max(1000).optional()
        .messages({
            "string.base": "Review text must be a string.",
            "string.max": "Review text cannot exceed 1000 characters."
        }),

    image: Joi.string().uri().optional()
        .messages({
            "string.uri": "Image must be a valid URL."
        })
});

// Function to validate review data
const validateReview = (data) => {
    const { error } = reviewSchema.validate(data, { abortEarly: false });
    return { error };
};

module.exports = validateReview;
