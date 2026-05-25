const User = require('../models/User');
const { AppError } = require('../middleware/errorMiddleware');
const { attachTokenCookie, generateToken } = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const registerUser = async ({ name, email, password, confirmPassword }) => {
  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match', 422, { confirmPassword: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409, { email: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return user;
};

const issueAuthResponse = (res, user, message) => {
  const token = generateToken(user._id);
  attachTokenCookie(res, token);

  return {
    message,
    data: {
      token,
      user: sanitizeUser(user)
    }
  };
};

module.exports = {
  issueAuthResponse,
  loginUser,
  registerUser,
  sanitizeUser
};
