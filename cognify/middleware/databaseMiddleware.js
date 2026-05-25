const mongoose = require('mongoose');
const { AppError } = require('./errorMiddleware');

const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  next(new AppError('Database is not connected. Set MONGO_URI in .env and restart the server.', 503));
};

module.exports = requireDatabase;
