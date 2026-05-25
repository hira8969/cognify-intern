const { sendError } = require('../utils/apiResponse');

class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

const notFoundMiddleware = (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next(new AppError(`API route not found: ${req.originalUrl}`, 404));
  }

  res.status(404).render('404', {
    title: 'Page Not Found',
    message: 'The route you opened does not exist in this Cognifyz Task 5 project.'
  });
};

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  if (err.name === 'ValidationError') {
    message = 'Validation failed';
    errors = Object.values(err.errors).reduce((errorMap, validationError) => {
      errorMap[validationError.path] = validationError.message;
      return errorMap;
    }, {});
  }

  if (err.code === 11000) {
    message = 'Duplicate value already exists';
    errors = Object.keys(err.keyValue || {}).reduce((errorMap, key) => {
      errorMap[key] = `${key} already exists`;
      return errorMap;
    }, {});
  }

  if (!err.isOperational) {
    console.error(err);
  }

  if (req.originalUrl.startsWith('/api')) {
    return sendError(res, {
      statusCode,
      message,
      errors
    });
  }

  res.status(statusCode).render('404', {
    title: statusCode === 404 ? 'Page Not Found' : 'Server Error',
    message
  });
};

module.exports = {
  AppError,
  errorMiddleware,
  notFoundMiddleware
};
