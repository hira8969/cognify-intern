const { validationResult } = require('express-validator');

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const asyncHandler = (controller) => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  const error = new Error('Validation failed.');
  error.statusCode = 422;
  error.errors = validationErrors.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));

  return next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate record found.',
      errors: Object.keys(error.keyPattern || {}).map((field) => ({
        field,
        message: `${field} already exists.`
      }))
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier.',
      errors: []
    });
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Your session has expired. Please log in again.',
      errors: []
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error.',
    errors: error.errors || []
  });
};

module.exports = {
  asyncHandler,
  validateRequest,
  notFound,
  errorHandler
};
