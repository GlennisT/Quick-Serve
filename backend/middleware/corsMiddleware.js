const cors = require('cors');

const corsOptions = {
    origin: '*', // Allows all origins (set specific origins in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authorization headers
    optionsSuccessStatus: 204, // Fix for legacy browsers like IE11
};

module.exports = cors(corsOptions);
