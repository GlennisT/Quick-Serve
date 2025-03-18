const errorMiddleware = (err, req, res, next) => {
    // 1. Log the error (optional, but recommended)
    console.error('Error:', err);

    // 2. Determine the status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // 3. Send the error response
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Send stack trace in development
    });
};

module.exports = errorMiddleware;