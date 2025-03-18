const cors = require('cors');

const corsMiddleware = (req, res, next) => {
    // 1. Configure CORS options (optional)
    const corsOptions = {
        origin: '*', // Allows all origins (use specific origins in production)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Allow cookies to be sent
        optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    // 2. Apply CORS middleware with configured options
    cors(corsOptions)(req, res, next);
};

module.exports = corsMiddleware;