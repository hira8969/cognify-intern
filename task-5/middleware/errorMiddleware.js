const { sendError } = require('../utils/responseHandler');

const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    console.error(err);
  }

  return sendError(res, statusCode, message, err.errors);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
