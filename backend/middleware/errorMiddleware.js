const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack trace only in development
    });
};

module.exports = errorMiddleware;
