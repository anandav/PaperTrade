const ApiError = require('../common/ApiError');

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!(err instanceof ApiError)) {
        // For non-ApiError types, default to a 500 server error
        statusCode = 500;
        message = 'Internal Server Error';
        // In development, you might want to log the full error
        if (process.env.NODE_ENV === 'development') {
            console.error(err);
        }
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Optionally include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
