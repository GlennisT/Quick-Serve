const morgan = require('morgan');

const loggingMiddleware = morgan('combined'); // 'combined' format is a common choice

module.exports = loggingMiddleware;