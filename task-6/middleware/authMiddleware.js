const jwt = require('jsonwebtoken');
const User = require('../models/User');

const readTokenFromRequest = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    return authorizationHeader.split(' ')[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = readTokenFromRequest(req);

    if (!token) {
      if (req.accepts('html') && !req.path.startsWith('/api')) {
        return res.redirect('/login');
      }

      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        errors: []
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
        errors: []
      });
    }

    req.user = user;
    res.locals.currentUser = user.toSafeObject();
    return next();
  } catch (error) {
    return next(error);
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action.',
      errors: []
    });
  }

  return next();
};

const redirectIfAuthenticated = async (req, res, next) => {
  try {
    const token = readTokenFromRequest(req);

    if (!token) {
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next();
    }

    return res.redirect('/dashboard');
  } catch (error) {
    return next();
  }
};

module.exports = {
  protect,
  authorize,
  redirectIfAuthenticated
};
