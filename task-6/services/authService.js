const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const buildAuthPayload = (user) => {
  const safeUser = user.toSafeObject();
  const token = generateToken({
    id: safeUser.id,
    role: safeUser.role
  });

  return {
    token,
    user: safeUser
  };
};

const registerUser = async (registrationData) => {
  const existingUser = await User.findOne({ email: registrationData.email });

  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name: registrationData.name,
    email: registrationData.email,
    password: registrationData.password
  });

  return buildAuthPayload(user);
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  return buildAuthPayload(user);
};

module.exports = {
  registerUser,
  loginUser
};
