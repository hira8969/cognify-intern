const { validationResult } = require('express-validator');
const { AppError } = require('./errorMiddleware');

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().reduce((errorMap, error) => {
    errorMap[error.path] = error.msg;
    return errorMap;
  }, {});

  next(new AppError('Validation failed', 422, errors));
};

module.exports = validateRequest;
