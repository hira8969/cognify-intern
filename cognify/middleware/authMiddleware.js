const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorMiddleware');

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) return req.cookies.token;

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      if (!req.originalUrl.startsWith('/api')) {
        return res.redirect('/login');
      }
      throw new AppError('Authentication required', 401);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) {
      if (!req.originalUrl.startsWith('/api')) {
        return res.redirect('/login');
      }
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (error) {
    if (!req.originalUrl.startsWith('/api')) {
      return res.redirect('/login');
    }
    next(error.name === 'JsonWebTokenError' ? new AppError('Invalid or expired token', 401) : error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorized to perform this action', 403));
    }

    next();
  };
};

const redirectIfAuthenticated = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id).select('-password');

    if (!user) return next();
    return res.redirect('/dashboard');
  } catch {
    next();
  }
};

module.exports = {
  authorize,
  protect,
  redirectIfAuthenticated
};
